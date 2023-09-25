import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-checkins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

describe('Fetch User Check-in History Use Case', () => {
  let checkInsRepository: InMemoryCheckInsRepository
  let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      checkInsRepository,
    )
  })

  it('should be able to check in', async () => {
    await checkInsRepository.create({
      gym_id: '01',
      user_id: '01',
    })
    await checkInsRepository.create({
      gym_id: '02',
      user_id: '01',
    })

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: '01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: '01' }),
      expect.objectContaining({ gym_id: '02' }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `${i}`,
        user_id: '01',
      })
    }

    const { checkIns } = await fetchUserCheckInsHistoryUseCase.execute({
      userId: '01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: '21' }),
      expect.objectContaining({ gym_id: '22' }),
    ])
  })
})
