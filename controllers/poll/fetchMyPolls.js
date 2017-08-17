import Poll from './../../models/poll';

export default (req, res, next) => {
    let userId = req.user.id;
    if (!userId) {
        res.status(400).send({ error: 'User ID is needed.' });
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
};