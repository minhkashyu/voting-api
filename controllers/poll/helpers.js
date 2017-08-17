import Poll from './../../models/poll';

const helpers = {
    getPollById: (pollId, callback) => {
        if (!pollId || pollId === 'undefined') {
            return callback({
                status: 400,
                message: 'Poll ID is needed.'
            });
        }

        Poll.findOne({ _id: pollId })
            .select('id title author options votedBy')
            .exec((err, poll) => {
                if (err || !poll) {
                    return callback({
                        status: 404,
                        message: `Poll with ID ${pollId} cannot be found.`
                    });
                }

                return callback(null, poll);
            });
    }
};

export default helpers;