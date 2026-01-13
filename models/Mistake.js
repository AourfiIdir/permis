import mongoose from 'mongoose';

const MistakeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Items',
    required: true
  },
}, {
  timestamps: true
});

export default mongoose.model('Mistake', MistakeSchema);
