import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PollSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        options: [{
            name: {
                type: String,
                required: true
            },
            vote: {
                type: Number,
                required: true,
                default: 0
            }
        }],
        votedBy: {
            type: Array
        }
    },
    {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
    }
);

PollSchema.path('options').validate(options =>{
    if (!options) {
        return false;
    }
    else if (options.length < 2) {
        return false;
    }
    return true;
}, 'Poll needs to have at least 2 options');


export default mongoose.model('Poll', PollSchema);