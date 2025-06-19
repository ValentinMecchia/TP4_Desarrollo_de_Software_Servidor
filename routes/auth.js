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
    console.log('Sesión después de autenticación:', req.session);
    console.log('Usuario autenticado:', req.user);
    req.session.save((err) => {
      if (err) {
        console.error('Error al guardar sesión:', err);
        return res.status(500).send('Error al guardar sesión');
      }
      const redirectUrl = process.env.NODE_ENV === 'production'
        ? 'https://tp-4-desarrollo-de-software-cliente.vercel.app/dashboard'
        : 'http://localhost:5173/dashboard';
      console.log('Redirigiendo a:', redirectUrl);
      res.redirect(redirectUrl);
    });
  }
);

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