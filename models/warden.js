const mongoose = require("mongoose");

const wardenSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    floor: {
      type: Number,
      required: true,
    },
    segment1: {
      type: String,
      required: true,
    },
    segment2: {
      type: String,
      required: true,
    },
    segment3: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Warden = mongoose.model("Warden", wardenSchema);

module.exports = Warden;
