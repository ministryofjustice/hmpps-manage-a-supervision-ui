import express from 'express'
import request from 'supertest'
import setUpRateLimiter from './setUpRateLimiter'

jest.mock('../config', () => ({
  __esModule: true,
  default: { rateLimit: { windowMs: 60_000, limit: 2 } },
}))

describe('middleware/setUpRateLimiter', () => {
  const app = express()
  app.use(setUpRateLimiter())
  app.get('/', (_req, res) => {
    res.send('ok')
  })

  it('allows requests up to the limit then responds 429', async () => {
    await request(app).get('/').expect(200)
    await request(app).get('/').expect(200)
    const res = await request(app).get('/').expect(429)
    expect(res.text).toEqual('Too many requests, please try again later.')
    expect(res.headers['ratelimit-policy']).toBeDefined()
  })
})
