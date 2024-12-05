import { Router } from 'express'
import type { Services } from '../services'

export default function searchRoutes(router: Router, { searchService }: Services) {
  router.post('/search', searchService.post)
  router.get('/search', searchService.get, (req, res) => {
    req.session.backLink = '/search'
    res.render('pages/search')
  })
}
