import { Router } from 'express'

export default function accessibilityRoutes(router: Router) {
  router.get('/accessibility', (req, res) => {
    res.render('pages/accessibility')
  })
}
