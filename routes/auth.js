const express = require('express');
const passport = require('passport');
const router = express.Router();

const VERCEL_PROD_DOMAIN = 'https://tp-4-desarrollo-de-software-cliente.vercel.app';

function isVercelFrontendOrigin(origin) {
  return origin && origin.endsWith('.vercel.app') && origin.includes('tp-4-desarrollo-de-software-cliente');
}

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  prompt: 'select_account',
  accessType: 'offline',
}));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Backend Callback: req.isAuthenticated() =', req.isAuthenticated());
    console.log('Backend Callback: req.user =', req.user ? req.user.user_id : 'No user'); // Usar req.user.user_id si tu ID de usuario está en user_id
    console.log('Backend Callback: req.session ID =', req.session ? req.session.id : 'No session');

    const clientOrigin = req.headers.origin || req.headers.referer;

    let redirectUrl = VERCEL_PROD_DOMAIN;

    if (clientOrigin && isVercelFrontendOrigin(clientOrigin)) {
      redirectUrl = clientOrigin;
    } else if (process.env.NODE_ENV === 'development') {
      redirectUrl = 'http://localhost:5173';
    }

    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión antes de redirigir:", err);
        return res.redirect('/');
      }
      res.redirect(`${redirectUrl}/dashboard`);
    });
  }
);

// === ESTAS RUTAS Y LA EXPORTACIÓN DEBEN ESTAR FUERA DEL CALLBACK ===

router.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

router.post('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: 'Logged out successfully' });
    });
  });
});

module.exports = router;