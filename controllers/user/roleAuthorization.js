import User from './../../models/user';
import helpers from './helpers';

export default requiredRole => {
    return (req, res, next) => {
        let userId = req.user.id;

        User.findById({ _id: userId }, (err, foundUser) => {
            if (err || !foundUser) {
                res.status(422).json({ error: 'No user was found.' });
                return next(err);
            }

            if (helpers.getRole(foundUser.role) >= helpers.getRole(requiredRole)) {
                return next();
            }

            return res.status(401).json({ error: 'You are not authorized to view this content.' });
        });
    };
};