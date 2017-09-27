import passport from './../../config/passport';
import helpers from './helpers';
import config from './../../config/main';

export default {
    facebookLogin: passport.authenticate('facebook', { scope : 'email', session: false }),
    facebookLoginCb: (req, res, next) => passport.authenticate('facebook', { session: false }, (err, user, info) => {
        if (err || !user) {
            res.status(400).json({ error: 'Cannot process Facebook Login.' });
            return next();
        }

        const userInfo = helpers.setFacebookInfo(user);
        const token = `JWT ${helpers.generateToken(userInfo)}`;
        res.redirect(301, config.client_url + '/login-success/facebook/' + token);
    })(req, res, next)
};