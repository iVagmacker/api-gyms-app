import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics'

describe('Get User Metrics Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let getUserMetricsUseCase: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    getUserMetricsUseCase = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: '01',
      user_id: '01',
    })
    await checkInsRepository.create({
      gym_id: '02',
      user_id: '01',
    })

    const { checkInsCount } = await getUserMetricsUseCase.execute({
      userId: '01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
