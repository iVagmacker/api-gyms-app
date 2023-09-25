import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { LateCheckInValidationError } from '../errors/late-check-in-validation-error'

describe('Validate Check In Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let validateCheckInUsecase: ValidateCheckInUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUsecase = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: '01',
      user_id: '01',
    })

    const { checkIn } = await validateCheckInUsecase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      validateCheckInUsecase.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('shoud not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40))
    const createdCheckIn = await checkInsRepository.create({
      gym_id: '01',
      user_id: '01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      validateCheckInUsecase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
