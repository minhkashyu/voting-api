import helpers from './helpers';

export default (req, res, next) => {
    const userInfo = req.headers.media === 'facebook' ? helpers.setFacebookInfo(req.user) : helpers.setGoogleInfo(req.user);
    res.status(201).json({
        token: req.headers.authorization,
        user: userInfo
    });
    return next();
};