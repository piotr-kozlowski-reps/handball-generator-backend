import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { TUser } from "../utils/app.types";

const userSchema = new mongoose.Schema<TUser>({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
  },
  refreshToken: String,
});

userSchema.plugin(uniqueValidator);
export default mongoose.model("User", userSchema);
