import express from "express";
import {
  acceptFriendRequest,
  editProfile,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  rejectFriendRequest,
  sendFriendRequest,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.put("/friend-request/:id/rejected", rejectFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

router.put("/profile", editProfile);

export default router;
