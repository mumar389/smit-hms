const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    segment: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      required: true,
    },
    desc: {
      type: String,
    },
    ntype: {
      type: String,
      required: true,
    },
    compid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complain",
      default:null
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
