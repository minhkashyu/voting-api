import helpers from './helpers';

export default (req, res, next) => {
    let pollId = req.params.pollId;

    helpers.getPollById(pollId, (err, poll) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }
        return res.status(200).json({ poll: poll });
    });
};