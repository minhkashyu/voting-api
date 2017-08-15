import User from './../models/user';
import passport from 'passport';
import passportJWT from './passport.jwt';
import { login, register } from './passport.local';
import passportFacebook from './passport.facebook';
import passportGoogle from './passport.google';

passport.use(passportJWT);
passport.use('register', register);
passport.use('login', login);
passport.use(passportFacebook);
passport.use(passportGoogle);

export default passport;
