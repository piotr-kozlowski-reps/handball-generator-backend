import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { TTeam } from "../utils/app.types";

const teamSchema = new mongoose.Schema<TTeam>({
  teamName: { type: String, required: true, unique: true },
  place: { type: String, required: true },
  teamCrestImage: { type: String, required: true },
});

teamSchema.plugin(uniqueValidator);
export default mongoose.model("Team", teamSchema);
