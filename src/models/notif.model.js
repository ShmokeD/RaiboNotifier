import mongoose , {Schema} from "mongoose";

const jobSchema = new Schema({
    recievers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    message: {
        type: String,
        required: true,
    },
    channel:{
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing','sent', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});


export const Job = mongoose.model('Jobs', jobSchema);
