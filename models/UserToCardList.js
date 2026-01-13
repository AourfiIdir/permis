import mongoose from "mongoose";

const CompleteSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'incomplete'],
        required: true
    }
}, {
    timestamps: true
});
export default mongoose.model('Complete', CompleteSchema);