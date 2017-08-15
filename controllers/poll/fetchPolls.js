import Poll from './../../models/poll';

export default (req, res, next) => {
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
};