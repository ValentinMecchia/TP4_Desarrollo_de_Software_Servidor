const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0].value;
        const nickName = profile.displayName;
        const photoURL = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        let user = await User.findOne({ where: { email } });

        if (!user) {
            user = await User.create({ email, nickName, photoURL });
        } else if (user.photoURL !== photoURL) {
            user.photoURL = photoURL;
            await user.save();
        }

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    console.log('Passport: Serializing user ID:', user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);
        console.log('🔄 Deserializando user:', user?.id);
        done(null, user);
    } catch (err) {
        console.error('❌ Error deserializando:', err);
        done(err, null);
    }
});
