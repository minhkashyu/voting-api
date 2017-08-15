import register from './register';
import login from './login';
import facebook from './facebook';
import google from './google';
import forgotPassword from './forgotPassword';
import verifyToken from './verifyToken';
import roleAuthorization from './roleAuthorization';

import passport from './../../config/passport';
import helpers from './helpers';

const requireAuth = passport.authenticate('jwt', { session: false });
const loginSuccess = (req, res, next) => {
    const userInfo = req.headers.media === 'facebook' ? helpers.setFacebookInfo(req.user) : helpers.setGoogleInfo(req.user);
    res.status(201).json({
        token: req.headers.authorization,
        user: userInfo
    });
};

export default {
    requireAuth: requireAuth,
    register: register,
    login: login,
    loginSuccess: loginSuccess,
    facebookLogin: facebook.facebookLogin,
    facebookLoginCb: facebook.facebookLoginCb,
    googleLogin: google.googleLogin,
    googleLoginCb: google.googleLoginCb,
    forgotPassword: forgotPassword,
    verifyToken: verifyToken,
    roleAuthorization: roleAuthorization
};