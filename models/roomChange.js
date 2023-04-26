const mongoose = require("mongoose");

const roomChangeSchema = new mongoose.Schema(
  {
    adminApproval: {
      type: String,
      default: "Not Approved",
    },
    studentApproval: [
      {
        status: {
          type: String,
          default: "Not Approved",
        },
        desc: {
          type: String,
        },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          default: null,
        },
      },
    ],
    reason: {
      type: String,
      required: true,
    },
    shiftCount: {
      type: Number,
    },
    changeType: {
      type: String,
      required: true,
    },
    allocationType: {
      type: String,
    },
    currentRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    requestBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    swapRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      default: null,
    },
    newDetails: {
      withUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
      },
      rno: {
        type: Number,
      },
      segment: {
        type: String,
      },
      floor: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Change = mongoose.model("Change", roomChangeSchema);

module.exports = Change;
