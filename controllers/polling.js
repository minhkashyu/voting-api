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