import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true,
     trim: true
   },
});

export default mongoose.model('Modules', ListSchema);
