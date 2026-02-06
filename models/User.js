import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const UsersSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      trim: true,
    },

    prenom: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },

    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // hidden by default
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // allows null for local users
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    sexe: {
      type: String,
      enum: ["male", "female"],
    },

    wilaya: {
      type: String,
    },

    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);


UsersSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
});



export default mongoose.model('User', UsersSchema);
