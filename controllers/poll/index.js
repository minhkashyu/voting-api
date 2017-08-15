import fetchPolls from './fetchPolls';
import fetchMyPolls from './fetchMyPolls';
import fetchSinglePoll from './fetchSinglePoll';
import addPoll from './addPoll';
import deletePoll from './deletePoll';
import submitVote from './submitVote';
import voteNewOption from './voteNewOption';

export default {
    fetchPolls: fetchPolls,
    fetchMyPolls: fetchMyPolls,
    fetchSinglePoll: fetchSinglePoll,
    addPoll: addPoll,
    deletePoll: deletePoll,
    submitVote: submitVote,
    voteNewOption: voteNewOption
};