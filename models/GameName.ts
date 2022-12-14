import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { TGameName } from "../utils/app.types";

const gameNameSchema = new mongoose.Schema<TGameName>({
  gameName: { type: String, required: true, unique: true },
  gameImage: { type: String, required: true },
});

gameNameSchema.plugin(uniqueValidator);
export default mongoose.model("GameName", gameNameSchema);
