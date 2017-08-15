import passport from './../../config/passport';
import helpers from './helpers';

export default (req, res, next) => passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(400).json({ error: info.message });
    }
    const userInfo = helpers.setLocalUserInfo(user);

    res.status(201).json({
        token: `JWT ${helpers.generateToken(userInfo)}`,
        user: userInfo
    });
})(req, res, next);