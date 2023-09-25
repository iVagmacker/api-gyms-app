import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymUseCase } from '../fetch-nearby-gyms'

describe('Fetch Nearby Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let fetchNearbyGymUseCase: FetchNearbyGymUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymUseCase = new FetchNearbyGymUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
      phone: null,
      description: null,
    })
    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -27.0610928,
      longitude: -49.5229501,
      phone: null,
      description: null,
    })

    const { gyms } = await fetchNearbyGymUseCase.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
