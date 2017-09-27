import passport from './../../config/passport';
import helpers from './helpers';

export default (req, res, next) => passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
        return res.status(404).json({ error: 'Cannot process your login.' });
    }
    if (!user) {
        return res.status(404).json({ error: info.message });
    }
    const userInfo = helpers.setLocalUserInfo(user);

    res.status(200).json({
        token: `JWT ${helpers.generateToken(userInfo)}`,
        user: userInfo
    });
})(req, res, next);