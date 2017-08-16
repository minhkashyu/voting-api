import User from './../../models/user';

export default (req, res, next) => {
    let token = req.params.token;
    let newPassword = req.body.password;

    if (!token || token === 'undefined') {
        return res.status(400).json({ error: 'Token is needed to verify.' });
    }
    if (!newPassword) {
        return res.status(400).json({ error: 'A new password is needed.' });
    }

    User.findOne({
            'local.resetPasswordToken': token,
            'local.resetPasswordExpires': { $gt: Date.now() }
        }, (err, resetUser) => {
            if (err || !resetUser) {
                return res.status(404).json({ error: 'Your token has expired. Please reset your password again.' });
            }

            resetUser.generateHash(newPassword, (error, hash) => {
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

                return res.status(200).json({ message: 'Password is reset successfully. Please login with your new password.' });
            });
        }
    );
};