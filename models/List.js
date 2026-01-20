import mongoose from 'mongoose';

const ListSchema = new mongoose.Schema({
   name: {
     type: String,
     required: true,
     trim: true
   },
   description:{
    type:String
   },
   createdBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:true
   },
   cards:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Card",
      required:true
   }]
});

export default mongoose.model('Modules', ListSchema);
