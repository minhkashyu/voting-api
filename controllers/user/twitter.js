import passport from './../../config/passport';
import helpers from './helpers';
import config from './../../config/main';

export default {
    twitterLogin: passport.authenticate('twitter', { session: false }),
    twitter: (req, res, next) => passport.authenticate('facebook', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json({ error: info.message });
        }

        const userInfo = helpers.setTwitterInfo(user);
        const token = `JWT ${helpers.generateToken(userInfo)}`;

        res.status(200).json({
            token: token,
            user: userInfo
        });
    })(req, res, next)
};