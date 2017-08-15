import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from './../../models/user';
import config from './../../config/main';
import passport from './../../config/passport';

import { setLocalUserInfo, setFacebookInfo, setTwitterInfo, setGoogleInfo, getRole } from './helpers';

const generateToken = user => {
    return jwt.sign(user, config.secret, {
        expiresIn: 10800 // 3 hrs
    });
};

export const requireAuth = passport.authenticate('jwt', { session: false });
export const loginSuccess = (req, res, next) => {
    const userInfo = req.headers.media === 'facebook' ? setFacebookInfo(req.user) : setGoogleInfo(req.user);
    res.status(201).json({
        token: req.headers.authorization,
        user: userInfo
    });
};

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

export const register = (req, res, next) => passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(400).json({ error: info.message });
    }
    const userInfo = setLocalUserInfo(user);

    res.status(201).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
})(req, res, next);

export const login = (req, res, next) => passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(404).json({ error: info.message });
    }
    const userInfo = setLocalUserInfo(user);

    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
})(req, res, next);

export const facebookLogin = passport.authenticate('facebook', { scope : 'email', session: false });
export const facebookLoginCb = (req, res, next) => passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(400).json({ error: info.message });
    }

    const userInfo = setFacebookInfo(user);
    const token = `JWT ${generateToken(userInfo)}`;
    res.redirect(301, config.client_url + '/login-success/facebook/' + token);
})(req, res, next);


//export const twitterLogin = passport.authenticate('twitter', { session: false });
//export const twitter = (req, res, next) => {
//    const userInfo = setTwitterInfo(req.user);
//
//    res.status(200).json({
//        token: `JWT ${generateToken(userInfo)}`,
//        user: userInfo
//    });
//};

export const googleLogin = passport.authenticate('google', { scope : ['profile', 'email'], session: false });
export const googleLoginCb = (req, res, next) => passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
        return next(err);
    }
    if (!user) {
        return res.status(400).json({ error: info.message });
    }

    const userInfo = setGoogleInfo(user);
    const token = `JWT ${generateToken(userInfo)}`;
    res.redirect(301, config.client_url + '/login-success/google/' + token);
})(req, res, next);

//= =======================================
// Authorization Middleware
//= =======================================

export const roleAuthorization = (requiredRole) => {
    return (req, res, next) => {
        const user = req.user;

        User.findById(user._id, (err, foundUser) => {
            if (err) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            if (getRole(foundUser.role) >= getRole(requiredRole)) {
                return next();
            }

            return res.status(401).json({ error: 'You are not authorized to view this content.' });
        });
    };
};

//= =======================================
// Forgot Password Route
//= =======================================

export const forgotPassword = (req, res, next) => {
    const email = req.body.email;

    User.findOne({ 'local.email': email }, (err, existingUser) => {
        if (err) {
            return next(err);
        }

        if (!existingUser) {
            return res.status(422).json({ error: 'Your email can not be processed. Please check it.'});
        }

        // If user is found, generate and save resetToken
        // Generate a token with Crypto
        crypto.randomBytes(48, (err, buffer) => {
            if (err) {
                return next(err);
            }

            const resetToken = buffer.toString('hex');
            existingUser.local.resetPasswordToken = resetToken;
            existingUser.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour

            existingUser.save(err => {
                if (err) {
                    return next(err);
                }

                const message = {
                    subject: 'Reset Password',
                    text: `${'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://'}${req.headers.host}/reset-password/${resetToken}\n\n` +
                    `If you did not request this, please ignore this email and your password will remain unchanged.\n`
                };
                // TODO: add email service

                return res.status(200).json({ message: 'Please check your email for the link to reset your password.' });
            });
        });
    });
};

//= =======================================
// Reset Password Route
//= =======================================

export const verifyToken = (req, res, next) => {
    User.findOne({
            'local.resetPasswordToken': req.params.token,
            'local.resetPasswordExpires': { $gt: Date.now() }
        }, (err, resetUser) => {
            if (err) {
                return next(err);
            }

            if (!resetUser) {
                return res.status(422).json({ error: 'Your token has expired. Please reset your password again.' });
            }

            resetUser.generateHash(req.body.password, (error, hash) => {
                if (error) {
                    return next(error);
                }
                resetUser.local.password = hash;
            });
            resetUser.local.resetPasswordToken = undefined;
            resetUser.local.resetPasswordExpires = undefined;

            resetUser.save(err => {
                if (err) {
                    return next(err);
                }

                const message = {
                    subject: 'Password Changed',
                    text: 'You are receiving this email because you changed your password. \n\n' +
                    'If you did not request this change, please contact us immediately.'
                };
                // TODO: add email service

                return res.status(200).json({ message: 'Password is changed successfully. Please login with your new password.' });
            });
        }
    );
};