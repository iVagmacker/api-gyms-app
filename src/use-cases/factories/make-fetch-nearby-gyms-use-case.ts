import { FetchNearbyGymUseCase } from '../fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const useCase = new FetchNearbyGymUseCase(gymRepository)

  return useCase
}
