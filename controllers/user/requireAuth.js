import passport from './../../config/passport';

export default (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(401).json({ error: 'No auth token.' });
    }
    req.user = user;
    next();
})(req, res, next);