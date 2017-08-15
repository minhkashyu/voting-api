import requireAuth from './requireAuth';
import register from './register';
import login from './login';
import getMediaLogin from './getMediaLogin';
import facebook from './facebook';
import google from './google';
import forgotPassword from './forgotPassword';
import verifyToken from './verifyToken';
import roleAuthorization from './roleAuthorization';

export default {
    requireAuth: requireAuth,
    register: register,
    login: login,
    getMediaLogin: getMediaLogin,
    facebookLogin: facebook.facebookLogin,
    facebookLoginCb: facebook.facebookLoginCb,
    googleLogin: google.googleLogin,
    googleLoginCb: google.googleLoginCb,
    forgotPassword: forgotPassword,
    verifyToken: verifyToken,
    roleAuthorization: roleAuthorization
};