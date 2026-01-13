import mongoose from 'mongoose';
import validator from 'validator';

const UsersSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, "obligatory field"],
    trim: true
  },
  prenom: {
    type: String,
    required: [true, "obligatory field"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "obligatory field"],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, "obligatory field"],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  sexe: {
    type: String,
    enum: ['male', 'female'],
    required: [true, "obligatory field"]
  },
  wilaya: {
    type: String,
    required: [true, "obligatory field"]
  },
  
  age: {
    type: Number,
    min: [18, 'Age must be at least 18'],
  },

}, {
  timestamps: true
});

export default mongoose.model('Users', UsersSchema);
