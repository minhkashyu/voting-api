import { Strategy as TwitterStrategy } from 'passport-twitter';
import User from './../models/user';
import configAuth from './auth';

const twitter = new TwitterStrategy({
        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL
    },
    (token, tokenSecret, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'twitter.id' : profile.id }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                else {
                    let newUser = new User();

                    newUser.twitter.id          = profile.id;
                    newUser.twitter.token       = token;
                    newUser.twitter.username    = profile.username;
                    newUser.twitter.displayName = profile.displayName;

                    newUser.save(err => {
                        if (err) {
                            return done(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }
);

export default twitter;