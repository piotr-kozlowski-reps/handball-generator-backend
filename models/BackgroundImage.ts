import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { TBackgroundImage } from "../utils/app.types";

const backgroundImageSchema = new mongoose.Schema<TBackgroundImage>({
  backgroundImageName: { type: String, required: true, unique: true },
  backgroundImage: { type: String, required: true },
  backgroundImageThumbnail: { type: String, required: true },
});

backgroundImageSchema.plugin(uniqueValidator);
export default mongoose.model("BackgroundImage", backgroundImageSchema);
