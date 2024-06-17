import { Router } from 'express'

export default function accessibilityInfoRoutes(router: Router) {
  router.get('/accessibility-info', (req, res) => {
    res.render('pages/accessibility-info')
  })
}
