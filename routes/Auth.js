const express = require('express');
const passport = require('passport');
const router = express.Router();

// Ruta para iniciar login con Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback de Google OAuth
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirigir frontend tras login exitoso
        res.redirect('http://localhost:5173/dashboard');
    }
);

// Ruta para obtener usuario actual
router.get('/me', (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ user: null });
    }
});

// Ruta para logout
router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({ success: true });
    });
});

module.exports = router;
