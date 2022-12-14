import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { TSponsorsBar } from "../utils/app.types";

const sponsorsBarSchema = new mongoose.Schema<TSponsorsBar>({
  barName: { type: String, required: true, unique: true },
  sponsorsBarImage: { type: String, required: true },
});

sponsorsBarSchema.plugin(uniqueValidator);
export default mongoose.model("SponsorsBar", sponsorsBarSchema);
