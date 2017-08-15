import jwt from 'jsonwebtoken';
import { ROLE_MEMBER, ROLE_ADMIN } from './constants';
import config from './../../config/main';

const helpers = {
    generateToken: user => {
        return jwt.sign(user, config.secret, {
            expiresIn: 10800 // 3 hrs
        });
    },
    setLocalUserInfo: user => {
        return {
            id: user.id,
            name: `${user.local.firstName} ${user.local.lastName}`,
            email: user.local.email,
            role: user.role
        };
    },
    setFacebookInfo: user => {
        return {
            id      : user.id,
            token   : user.facebook.token,
            name    : user.facebook.name,
            email   : user.facebook.email,
            role    : user.role
        };
    },
    setTwitterInfo: user => {
        return {
            id          : user.id,
            token       : user.twitter.token,
            username    : user.twitter.username,
            name        : user.twitter.displayName,
            role        : user.role
        };
    },
    setGoogleInfo: user => {
        return {
            id      : user.id,
            token   : user.google.token,
            name    : user.google.name,
            email   : user.google.email,
            role    : user.role
        };
    },
    getRole: checkRole => {
        let role;

        switch (checkRole) {
            case ROLE_MEMBER: role = 1; break;
            case ROLE_ADMIN: role = 2; break;
            default: role = 1;
        }

        return role;
    }
};

export default helpers;