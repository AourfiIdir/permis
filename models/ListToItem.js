import mongoose from "mongoose";
const ContienSchema = new mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },
    CardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
}, {
    timestamps: true
});
export default mongoose.model('Contien', ContienSchema);