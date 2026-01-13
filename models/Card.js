import mongoose, { Schema } from "mongoose";
const cardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: Schema.Types.Mixed,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'Cards'
});
export default mongoose.model('Card', cardSchema);