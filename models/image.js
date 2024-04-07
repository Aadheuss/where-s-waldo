const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  name: { type: String, required: true },
  buffer: { type: Buffer, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});

ImageSchema.virtual("url").get(function () {
  return `/image/${this._id}`;
});

module.exports = mongoose.model("Image", ImageSchema);
