import passport from './../../config/passport';

export default passport.authenticate('jwt', { session: false });