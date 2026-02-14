import mongoose from 'mongoose';

const MistakeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  card: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Card',
    required: true
  },
  mistake:{
    type:String,
    unique:true
    required:true
  },
  
}, {
  timestamps: true
});

export default mongoose.model('Mistake', MistakeSchema);
