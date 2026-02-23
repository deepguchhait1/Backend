import mongoose from "mongoose";

const callHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["video", "audio"],
      required: true,
    },
    status: {
      type: String,
      enum: ["missed", "incoming", "outgoing", "completed"],
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    endedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const CallHistory = mongoose.model("CallHistory", callHistorySchema);
export default CallHistory;
