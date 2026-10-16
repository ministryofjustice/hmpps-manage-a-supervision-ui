import { RequestHandler } from 'express'
import { rateLimit } from 'express-rate-limit'
import config from '../config'

// Per-pod, in-memory limit keyed on client IP. app.ts sets `trust proxy` to a hop
// count (config.trustProxyHops) so req.ip is the address recorded by the ingress,
// not a client-supplied X-Forwarded-For value.
// Applied after health checks so k8s probes are never throttled.
export default function setUpRateLimiter(): RequestHandler {
  return rateLimit({
    windowMs: config.rateLimit.windowMs,
    limit: config.rateLimit.limit,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  })
}
