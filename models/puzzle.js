const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PuzzleSchema = new Schema({
  name: { type: String, required: true },
  buffer: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  coordinates: { type: String, required: true },
  image: { type: Schema.Types.ObjectId, ref: "Image", required: true },
});

PuzzleSchema.virtual("url").get(function () {
  return `/image/${this._id}`;
});

PuzzleSchema.virtual("base64_string").get(function () {
  return Buffer.from(this.buffer).toString("base64");
});

module.exports = mongoose.model("Puzzle", PuzzleSchema);
