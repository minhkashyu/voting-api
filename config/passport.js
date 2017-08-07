import User from './../models/user';
import passport from 'passport';
import passportJWT from './passport.jwt';
import { login, register } from './passport.local';
import passportFacebook from './passport.facebook';
//import passportTwitter from './passport.twitter';
import passportGoogle from './passport.google';

// for passport session
//passport.serializeUser(function (user, done) {
//	done(null, user.id);
//});
//
//passport.deserializeUser(function (id, done) {
//	User.findById(id, function (err, user) {
//		done(err, user);
//	});
//});

passport.use(passportJWT);
passport.use('register', register);
passport.use('login', login);
passport.use(passportFacebook);
//passport.use(passportTwitter);
passport.use(passportGoogle);

export default passport;
