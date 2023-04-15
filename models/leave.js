const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    leaveNo: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    wardenApproval: {
      type: String,
      default: "Not Approved",
    },
    parentApproval: {
      type: String,
      default: "Not Approved",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    warden: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warden",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
