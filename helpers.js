import { ROLE_MEMBER, ROLE_ADMIN } from './constants';

export function setLocalUserInfo(user) {
    return {
        id: user.id,
        name: `${user.local.firstName} ${user.local.lastName}`,
        email: user.local.email,
        role: user.role
    };
}

export function setFacebookInfo(user) {
    return {
        id      : user.id,
        token   : user.facebook.token,
        name    : user.facebook.name,
        email   : user.facebook.email,
        role    : user.role
    };
}

export function setTwitterInfo(user) {
    return {
        id          : user.id,
        token       : user.twitter.token,
        username    : user.twitter.username,
        name        : user.twitter.displayName,
        role        : user.role
    };
}

export function setGoogleInfo(user) {
    return {
        id      : user.id,
        token   : user.google.token,
        name    : user.google.name,
        email   : user.google.email,
        role    : user.role
    };
}

export function getRole(checkRole) {
    let role;

    switch (checkRole) {
        case ROLE_MEMBER: role = 1; break;
        case ROLE_ADMIN: role = 2; break;
        default: role = 1;
    }

    return role;
}