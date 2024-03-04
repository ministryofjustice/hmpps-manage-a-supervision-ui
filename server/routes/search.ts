import { Router } from 'express'
import type { Services } from '../services'

export default function searchRoutes(router: Router, { searchService }: Services) {
  router.post('/search', searchService.post)
  router.get('/search', searchService.get, (_, res) => res.render('pages/search'))
}
