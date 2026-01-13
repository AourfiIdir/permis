import mongoose from "mongoose";
import { type } from "os";
const ProgressSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    points : {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    collection: 'Progress'
});
export default mongoose.model('Progress', ProgressSchema);