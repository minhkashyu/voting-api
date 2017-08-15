import express from 'express';
import userController from './../controllers/user/index';
import pollController from './../controllers/poll/index';

module.exports = (app) => {
    const apiRoutes = express.Router();
    const authRoutes = express.Router();

    app.use('/api', apiRoutes);

    //=========================
    // Auth Routes
    //=========================
    apiRoutes.use('/auth', authRoutes);

    // POST /api/auth/register
    authRoutes.post('/register', userController.register);
    // POST /api/auth/login
    authRoutes.post('/login', userController.login);
    // POST /api/auth/forgot-password
    authRoutes.post('/forgot-password', userController.forgotPassword);
    // POST /api/auth//reset-password/:token
    authRoutes.post('/reset-password/:token', userController.verifyToken);

    // GET /api/auth/facebook
    authRoutes.get('/facebook', userController.facebookLogin);
    authRoutes.get('/facebook/callback', userController.facebookLoginCb);
    //authRoutes.get('/twitter', twitterLogin);
    //authRoutes.get('/twitter/callback', twitterLogin, twitter);
    // GET /api/auth/google
    authRoutes.get('/google', userController.googleLogin);
    authRoutes.get('/google/callback', userController.googleLoginCb);

    //Social Media tests to return token and userInfo to client side
    authRoutes.get('/loginSuccess', userController.requireAuth, userController.loginSuccess);

    //=========================
    // Poll Routes
    //=========================

    //fetchPolls()
    apiRoutes.get('/polls', pollController.fetchPolls);
    //fetchMyPolls()
    apiRoutes.get('/polls/my', userController.requireAuth, pollController.fetchMyPolls);
    //fetchSinglePoll()
    apiRoutes.get('/polls/:pollId', pollController.fetchSinglePoll);
    //addPoll(data)
    apiRoutes.post('/polls', userController.requireAuth, pollController.addPoll);
    //deletePoll()
    apiRoutes.delete(`/polls/:pollId`, userController.requireAuth, pollController.deletePoll);
    //submitVote()
    apiRoutes.post('/polls/:pollId/options/:optionId/vote', pollController.submitVote);
    //submitVote(data)
    apiRoutes.post('/polls/:pollId/options', userController.requireAuth, pollController.voteNewOption);
};
