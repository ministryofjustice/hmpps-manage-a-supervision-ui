import express from 'express'
import request from 'supertest'
import setUpRateLimiter from './setUpRateLimiter'
import config from '../config'

jest.mock('../config', () => ({
  __esModule: true,
  default: { trustProxyHops: 1, rateLimit: { windowMs: 60_000, limit: 2 } },
}))

const tooMany = 'Too many requests, please try again later.'

// Mirrors the proxy configuration used in app.ts
const createApp = () => {
  const app = express()
  app.set('trust proxy', config.trustProxyHops)
  app.use(setUpRateLimiter())
  app.get('/', (req, res) => {
    res.send(req.ip)
  })
  return app
}

describe('middleware/setUpRateLimiter', () => {
  it('allows requests up to the limit then responds 429', async () => {
    const app = createApp()
    await request(app).get('/').expect(200)
    await request(app).get('/').expect(200)
    const res = await request(app).get('/').expect(429)
    expect(res.text).toEqual(tooMany)
    expect(res.headers['ratelimit-policy']).toBeDefined()
  })

  it('keys on the address appended by the ingress, not a client-supplied X-Forwarded-For', async () => {
    const app = createApp()
    const ingressAppended = '203.0.113.9'
    // Attacker rotates the leftmost (spoofable) entries; the ingress always appends the real peer
    const spoofed = ['10.0.0.1', '10.0.0.2', '10.0.0.3']

    const first = await request(app).get('/').set('X-Forwarded-For', `${spoofed[0]}, ${ingressAppended}`).expect(200)
    expect(first.text).toEqual(ingressAppended)
    await request(app).get('/').set('X-Forwarded-For', `${spoofed[1]}, ${ingressAppended}`).expect(200)
    await request(app).get('/').set('X-Forwarded-For', `${spoofed[2]}, ${ingressAppended}`).expect(429)
  })

  it('does not share quota between distinct clients', async () => {
    const app = createApp()
    await request(app).get('/').set('X-Forwarded-For', '203.0.113.1').expect(200)
    await request(app).get('/').set('X-Forwarded-For', '203.0.113.1').expect(200)
    await request(app).get('/').set('X-Forwarded-For', '203.0.113.1').expect(429)
    await request(app).get('/').set('X-Forwarded-For', '203.0.113.2').expect(200)
  })
})
