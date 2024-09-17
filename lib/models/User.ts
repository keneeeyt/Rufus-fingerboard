import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  profile_image: {
    type: String,
  }
},{timestamps: true})

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;