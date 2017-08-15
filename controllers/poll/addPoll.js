import Poll from './../../models/poll';

export default (req, res, next) => {
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