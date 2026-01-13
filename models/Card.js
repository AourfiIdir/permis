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
        type: Schema.Types.Mixed,
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'Cards'
});
export default mongoose.model('Card', cardSchema);