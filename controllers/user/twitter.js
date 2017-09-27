import passport from './../../config/passport';
import helpers from './helpers';
import config from './../../config/main';

export default {
    twitterLogin: passport.authenticate('twitter', { session: false }),
    twitterLoginCb: (req, res, next) => passport.authenticate('twitter', { session: false }, (err, user) => {
        if (err || !user) {
            res.status(400).json({ error: 'Cannot process Twitter Login.' });
            return next();
        }

        const userInfo = helpers.setTwitterInfo(user);
        const token = `JWT ${helpers.generateToken(userInfo)}`;
        res.redirect(301, config.client_url + '/login-success/twitter/' + token);
    })(req, res, next)
};