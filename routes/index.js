import express from 'express';
import {
    requireAuth,
    loginSuccess,
    register,
    login,
    facebookLogin,
    facebookLoginCb,
    googleLogin,
    googleLoginCb,
    forgotPassword,
    verifyToken
    } from './../controllers/authentication';
import {
    fetchPolls,
    fetchMyPolls,
    fetchSinglePoll,
    addPoll,
    deletePoll,
    submitVote,
    voteNewOption
    } from './../controllers/polling';

// use session for passport
//var session = require('express-session');
//app.use(session({
//	secret: 'mks-voting-app',
//	resave: false,
//	saveUninitialized: true
//}));
//app.use(passport.initialize());
//app.use(passport.session());
//function isLoggedIn (req, res, next) {
//    if (req.isAuthenticated()) {
//        return next();
//    } else {
//        res.redirect('/login');
//    }
//}

module.exports = (app) => {
    // Initializing route groups
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    // Set url for API group routes
    app.use('/api', apiRoutes);

    //=========================
    // Auth Routes
    //=========================
    // Set auth routes as subgroup/middleware to apiRoutes
    apiRoutes.use('/auth', authRoutes);

    // POST /api/auth/register
    authRoutes.post('/register', register);
    // POST /api/auth/login
    authRoutes.post('/login', login);
    // POST /api/auth/forgot-password
    authRoutes.post('/forgot-password', forgotPassword);
    // POST /api/auth//reset-password/:token
    authRoutes.post('/reset-password/:token', verifyToken);

    // GET /api/auth/facebook
    authRoutes.get('/facebook', facebookLogin);
    authRoutes.get('/facebook/callback', facebookLoginCb);
    //authRoutes.get('/twitter', twitterLogin);
    //authRoutes.get('/twitter/callback', twitterLogin, twitter);
    // GET /api/auth/google
    authRoutes.get('/google', googleLogin);
    authRoutes.get('/google/callback', googleLoginCb);

    //Social Media tests to return token and userInfo to client side
    authRoutes.get('/loginSuccess', requireAuth, loginSuccess);

    //=========================
    // Poll Routes
    //=========================

    //fetchPolls()
    apiRoutes.get('/polls', fetchPolls);
    //fetchMyPolls()
    apiRoutes.get('/polls/my', requireAuth, fetchMyPolls);
    //fetchSinglePoll()
    apiRoutes.get('/polls/:pollId', fetchSinglePoll);
    //addPoll(data)
    apiRoutes.post('/polls', requireAuth, addPoll);
    //deletePoll()
    apiRoutes.delete(`/polls/:pollId`, requireAuth, deletePoll);
    //submitVote()
    apiRoutes.post('/polls/:pollId/options/:optionId/vote', submitVote);
    //submitVote(data)
    apiRoutes.post('/polls/:pollId/options', requireAuth, voteNewOption);
};
