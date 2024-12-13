const express = require("express");
const {
  sendFriendReq,
  acceptFriendReq,
  getFriends,
  removeFriends,
} = require("../controllers/friend");
const authMiddleware = require("../authMiddleware");
const User = require("../models/user");

const router = express.Router();

router.use(authMiddleware);

// Send a friend request
router.post("/request", sendFriendReq);

// Accept a friend request
router.put("/accept/:requestId", acceptFriendReq);

// Get the list of friends
router.get("/", getFriends);

// Remove a friend
router.delete("/:friendId", removeFriends);

// Route to get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

module.exports = router;
