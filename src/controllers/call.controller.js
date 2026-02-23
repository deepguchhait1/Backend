import CallHistory from "../models/CallHistory.js";
import User from "../models/User.js";

export const getCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch call history where the user is either the caller or receiver
    const callHistory = await CallHistory.find({
      $or: [{ userId }, { targetUserId: userId }],
    })
      .populate("targetUserId", "fullName profilePic")
      .populate("userId", "fullName profilePic")
      .sort({ createdAt: -1 })
      .limit(50);

    // Format the response to show the other user's info
    const formattedHistory = callHistory.map((call) => {
      const isCurrentUser = call.userId._id.toString() === userId;
      const otherUser = isCurrentUser ? call.targetUserId : call.userId;

      // Calculate duration in MM:SS format
      let durationFormatted = null;
      if (call.duration > 0) {
        const minutes = Math.floor(call.duration / 60);
        const seconds = call.duration % 60;
        durationFormatted = `${minutes}:${seconds.toString().padStart(2, "0")}`;
      }

      // Format timestamp
      const callDate = new Date(call.startedAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let timestamp;
      if (callDate.toDateString() === today.toDateString()) {
        timestamp = callDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else if (callDate.toDateString() === yesterday.toDateString()) {
        timestamp = "Yesterday";
      } else if (today.getTime() - callDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
        timestamp = callDate.toLocaleDateString("en-US", { weekday: "long" });
      } else {
        timestamp = callDate.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }

      return {
        id: call._id,
        user: {
          _id: otherUser._id,
          fullName: otherUser.fullName,
          profilePic: otherUser.profilePic,
        },
        type: call.type,
        status: call.status,
        duration: durationFormatted,
        timestamp,
        date: call.startedAt,
      };
    });

    res.status(200).json(formattedHistory);
  } catch (error) {
    console.log("Error in getCallHistory controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCallHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, type, status, duration } = req.body;

    const callHistory = await CallHistory.create({
      userId,
      targetUserId,
      type,
      status,
      duration: duration || 0,
      startedAt: new Date(),
      endedAt: duration ? new Date() : null,
    });

    res.status(201).json(callHistory);
  } catch (error) {
    console.log("Error in createCallHistory controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
