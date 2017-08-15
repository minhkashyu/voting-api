import helpers from './helpers';

export default (req, res, next) => {
    let pollId = req.params.pollId;

    helpers.getPollById(pollId, (err, poll) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }
        poll.remove(err => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            return res.status(200).json({ message: 'The poll deleted successfully.'});
        });
    });
};