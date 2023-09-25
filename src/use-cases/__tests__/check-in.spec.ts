import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { CheckinUseCase } from '../check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from '../errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '../errors/max-number-of-check-ins-error'

describe('Check-in Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let checkInUseCase: CheckinUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckinUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: '01',
      title: 'JavaScript Gym',
      description: '',
      latitude: 0,
      longitude: 0,
      phone: '',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      gymId: '01',
      userId: '01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: '01',
      userId: '01',
      userLatitude: 0,
      userLongitude: 0,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: '01',
        userId: '01',
        userLatitude: 0,
        userLongitude: 0,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await checkInUseCase.execute({
      gymId: '01',
      userId: '01',
      userLatitude: 0,
      userLongitude: 0,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      gymId: '01',
      userId: '01',
      userLatitude: 0,
      userLongitude: 0,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: '02',
      title: 'Javascript Gym',
      latitude: new Decimal(-16.3536401),
      longitude: new Decimal(-48.9640007),
      phone: '',
      description: '',
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: '02',
        userId: '01',
        userLatitude: -16.2092052,
        userLongitude: -48.6401091,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
