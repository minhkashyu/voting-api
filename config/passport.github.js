import { Strategy as GitHubStrategy } from 'passport-github';
import User from './../models/user';
import configAuth from './auth';

const github = new GitHubStrategy({
        clientID: configAuth.githubAuth.clientID,
        clientSecret: configAuth.githubAuth.clientSecret,
        callbackURL: configAuth.githubAuth.callbackURL
    },
    (token, refreshToken, profile, done) => {
        process.nextTick(() => {
            User.findOne({ 'github.id': profile.id }, (err, user) => {
                if (err) {
                    return done(err);
                }
                if (user) {
                    return done(null, user);
                }
                else {
                    let newUser = new User();

                    newUser.github.id = profile.id;
                    newUser.github.username = profile.username;
                    newUser.github.displayName = profile.displayName;
                    newUser.github.publicRepos = profile._json.public_repos;
                    newUser.nbrClicks.clicks = 0;

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

export default github;