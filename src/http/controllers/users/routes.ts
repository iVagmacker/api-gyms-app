import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { register } from './register'
import { profile } from './profile'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
