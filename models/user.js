const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    reg_no: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    parentDetails: {
      contact: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
