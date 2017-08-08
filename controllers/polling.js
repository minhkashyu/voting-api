import Poll from './../models/poll';

export function fetchPolls(req, res, next) {
    Poll.find({})
        .select('id title')
        .sort('title')
        .exec((err, polls) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({ polls: polls });
        });
}

export function fetchMyPolls(req, res, next) {
    let userId = req.user.id;
    if (!userId) {
        res.status(422).send({ error: 'User ID is needed.' });
        return next();
    }
    Poll.find({ author: userId })
        .select('id title')
        .sort('title')
        .exec((err, polls) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({ polls: polls });
        });
}

export function fetchSinglePoll(req, res, next) {
    let pollId = req.params.pollId;
    if (!pollId) {
        res.status(422).send({ error: 'Poll ID is needed.' });
        return next();
    }
    Poll.findOne({ _id: pollId })
        .select('id title author options')
        .exec((err, poll) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            return res.status(200).json({ poll: poll || {} });
        });
}

export function addPoll(req, res, next) {
    if (!req.body.title) {
        res.status(422).send({ error: 'Please enter a title.' });
        return next();
    }

    if (!req.body.options || req.body.options.length < 2) {
        res.status(422).send({ error: 'Please enter 2 or more options.' });
        return next();
    }

    let arrOptions = [];
    req.body.options.map((val) => {
        arrOptions.push({ name: val.toString(), vote: 0});
    });

    const poll = new Poll({
        title: req.body.title,
        author: req.user.id,
        options: arrOptions
    });

    poll.save((err, newPoll) => {
        if (err) {
            res.send({ error: err });
            return next(err);
        }

        return res.status(200).json({
            message: `New poll has been created.`,
            poll: newPoll
        });
    });
}

export function deletePoll(req, res, next) {
    let pollId = req.params.pollId;
    if (!pollId) {
        res.status(422).send({ error: 'Poll ID is needed.' });
        return next();
    }

    Poll.findOne({ _id: pollId })
        .exec((err, poll) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            if (!poll) {
                res.status(404).send({ error: 'Delete action can not be processed. Please check poll ID.' });
                return next();
            }
            poll.remove((err) => {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }
                return res.status(200).json({ message: 'The poll deleted successfully.'});
            });
        });
}

export function submitVote(req, res, next) {
    let pollId = req.params.pollId;
    let optionId = req.params.optionId;
    let userId  = req.body.userId;

    if (!pollId) {
        res.status(422).send({ error: 'Poll ID is needed.' });
        return next();
    }

    if (!optionId) {
        res.status(422).send({ error: 'Option ID is needed.' });
        return next();
    }

    Poll.findOne({ '_id': pollId})
        .exec((err, poll) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            if (!poll) {
                res.status(404).send({ error: 'The poll can not be found.' });
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
                res.status(400).send({ error: 'Option ID is not correct.' });
                return next();
            }
            doc.vote++;

            poll.save((err, newPoll) => {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }

                return res.status(200).json({
                    message: `Vote has been submitted.`,
                    poll: newPoll
                });
            });
        });
}

export function voteNewOption(req, res, next) {
    let pollId = req.params.pollId;
    let optionName = req.body.name;
    let userId  = req.user.id;

    if (!pollId) {
        res.status(422).send({ error: 'Poll ID is needed.' });
        return next();
    }

    if (!optionName) {
        res.status(422).send({ error: 'Option Name is needed.' });
        return next();
    }

    Poll.findOne({ '_id': pollId})
        .exec((err, poll) => {
            if (err) {
                res.send({ error: err });
                return next(err);
            }
            if (!poll) {
                res.status(404).send({ error: 'The poll can not be found.' });
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
                poll.votedBy.push({ voter: userId });
            }
            if (ipNotVoted) {
                poll.votedBy.push({ voter: clientIp });
            }

            poll.options.push({
                name: optionName,
                vote: 1
            });
            poll.save((err, newPoll) => {
                if (err) {
                    res.send({ error: err });
                    return next(err);
                }

                return res.status(200).json({
                    message: `Vote has been submitted.`,
                    poll: newPoll
                });
            });
        });
}