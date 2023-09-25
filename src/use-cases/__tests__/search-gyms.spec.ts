import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymUseCase } from '../search-gyms'

describe('Search Gyms Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let searchGymUseCase: SearchGymUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymUseCase = new SearchGymUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      latitude: -16.3536401,
      longitude: -48.9640007,
      phone: null,
      description: null,
    })
    await gymsRepository.create({
      title: 'Typescript Gym',
      latitude: -16.3536401,
      longitude: -48.9640007,
      phone: null,
      description: null,
    })

    const { gyms } = await searchGymUseCase.execute({
      query: 'Javascript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Typescript Gym ${i}`,
        latitude: -16.3536401,
        longitude: -48.9640007,
        phone: null,
        description: null,
      })
    }

    const { gyms } = await searchGymUseCase.execute({
      query: 'Typescript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Typescript Gym 21' }),
      expect.objectContaining({ title: 'Typescript Gym 22' }),
    ])
  })
})
