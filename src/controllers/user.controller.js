import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } },
        { _id: { $nin: currentUser.friends } },
        { isOnboarded: true },
      ],
    });
    res.status(200).json(recommendedUsers);
  } catch (error) {
    console.log("Error in getRecommendedUsers controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMyFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePic nativeLanguage learningLanguage bio location isOnline"
      );
    // return an object with a `friends` key so frontend can access
    // friendsQuery.data.friends consistently
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipent not found" });
    }

    if (recipient.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user" });
    }
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });
    if (existingRequest) {
      if (existingRequest.status && existingRequest.status !== "rejected") {
        return res.status(400).json({
          message: "A friend request already exists between you and this user",
        });
      }
      if (existingRequest.status === "rejected") {
        await FriendRequest.findByIdAndDelete(existingRequest._id);
      }
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });
    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const rejectFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(404)
        .json({ message: "You are not authorized to accept this request" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    // await User.findByIdAndUpdate(friendRequest.sender, {
    //   $addToSet: { friends: friendRequest.recipient },
    // });

    // await User.findByIdAndUpdate(friendRequest.recipient, {
    //   $addToSet: { friends: friendRequest.sender },
    // });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.log("Error in rejectFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getFriendRequests = async (req, res) => {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePic nativeLanguage learningLanguage isOnline"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic ");

    const rejectedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "rejected",
    }).populate("recipient", "fullName profilePic");

    res.status(200).json({ incomingReqs, acceptedReqs, rejectedReqs });
  } catch (error) {
    console.log("Error in getFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getOutgoingFriendReqs = async (req, res) => {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePic nativeLanguage learningLanguage isOnline"
    );

    res.status(200).json({ outgoingRequests });
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const editProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullName, email, bio, profilePic, nativeLanguage, learningLanguage, location } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePic !== undefined) updateData.profilePic = profilePic;
    if (nativeLanguage !== undefined) updateData.nativeLanguage = nativeLanguage;
    if (learningLanguage !== undefined) updateData.learningLanguage = learningLanguage;
    if (location !== undefined) updateData.location = location;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Update Stream user if profile pic or name changed
    if (fullName || profilePic) {
      try {
        await upsertStreamUser({
          id: updatedUser._id.toString(),
          name: updatedUser.fullName,
          image: updatedUser.profilePic || "",
        });
        console.log(`Stream user updated for ${updatedUser.fullName}`);
      } catch (error) {
        console.error("Failed to update Stream user:", error);
      }
    }

    res.status(200).json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.log("Error in editProfile controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
