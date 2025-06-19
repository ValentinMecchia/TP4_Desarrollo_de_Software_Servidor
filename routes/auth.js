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
    req.session.save(() => {
      res.send(`
        <html>
          <body>
            <script>
              window.opener?.postMessage("oauth-success", "*");
              window.close();
            </script>
          </body>
        </html>
      `);
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