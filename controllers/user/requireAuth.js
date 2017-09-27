import passport from './../../config/passport';

export default (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) {
        return res.status(401).json({ error: 'You are not authorised to do this. Please log in.' });
    }
    req.user = user;
    next();
})(req, res, next);