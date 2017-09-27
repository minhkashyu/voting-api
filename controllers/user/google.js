import passport from './../../config/passport';
import helpers from './helpers';
import config from './../../config/main';

export default {
    googleLogin: passport.authenticate('google', { scope : ['profile', 'email'], session: false }),
    googleLoginCb: (req, res, next) => passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err || !user) {
            res.status(400).json({ error: 'Cannot process Google Login.' });
            return next();
        }

        const userInfo = helpers.setGoogleInfo(user);
        const token = `JWT ${helpers.generateToken(userInfo)}`;
        res.redirect(301, config.client_url + '/login-success/google/' + token);
    })(req, res, next)
};