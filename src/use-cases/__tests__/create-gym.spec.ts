import { beforeEach, describe, expect, it } from 'vitest'
import { compare } from 'bcryptjs'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

describe('Create Gym Use Case', () => {
  let gymsRepository: InMemoryGymsRepository
  let createGymUseCase: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Javascript Gym',
      latitude: -16.3536401,
      longitude: -48.9640007,
      phone: null,
      description: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
