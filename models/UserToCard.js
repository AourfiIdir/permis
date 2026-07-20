import mongoose from "mongoose";

const CompleteSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['completed', 'uncomplete'],
        required: true
    },
    hit:{
        type:Number,
        default:0
    }
}, {
    timestamps: true
});

CompleteSchema.index({ userId: 1, cardId: 1 });
CompleteSchema.index({ userId: 1, hit: 1 });

export default mongoose.model('Complete', CompleteSchema);
