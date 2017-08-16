import User from './../../models/user';
import crypto from 'crypto';
import moment from 'moment';

export default (req, res, next) => {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({ error: 'Email address is needed.' });
    }

    User.findOne({ 'local.email': email }, (err, existingUser) => {
        if (err || !existingUser) {
            return res.status(404).json({ error: 'Your email can not be processed. Please check it.'});
        }

        // If user is found, generate and save resetToken
        // Generate a token with Crypto
        crypto.randomBytes(48, (err, buffer) => {
            if (err) {
                return next(err);
            }

            const resetToken = buffer.toString('hex');
            existingUser.local.resetPasswordToken = resetToken;
            existingUser.local.resetPasswordExpires = moment().add(1, 'hours').valueOf(); // 1 hour

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