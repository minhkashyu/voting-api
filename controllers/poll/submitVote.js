import helpers from './helpers';

export default (req, res, next) => {
    let pollId = req.params.pollId;
    let optionId = req.params.optionId;
    let userId  = req.body.userId;

    helpers.getPollById(pollId, (err, poll) => {
        if (err) {
            res.status(err.status).send({ error: err.message });
            return next();
        }
        if (!optionId || optionId === 'undefined' || optionId === 'null') {
            res.status(400).send({ error: 'Option ID is needed.' });
            return next();
        }

        //check if current ip or userId has voted for the poll
        let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
        let userNotVoted = userId && (poll.votedBy.indexOf(userId) === -1);
        let ipNotVoted = poll.votedBy.indexOf(clientIp) === -1;
        if (!userNotVoted && !ipNotVoted) {
            res.status(403).send({ error: 'You have already submitted a vote for this poll.' });
            return next();
        }
        if (userNotVoted) {
            poll.votedBy.push(userId);
        }
        if (ipNotVoted) {
            poll.votedBy.push(clientIp);
        }

        let doc = poll.options.id(optionId);
        if (!doc) {
            res.status(404).send({ error: 'Option ID is not correct.' });
            return next();
        }
        doc.vote++;

        poll.save((err, newPoll) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({
                message: 'Vote has been submitted.',
                poll: newPoll
            });
        });
    });
};