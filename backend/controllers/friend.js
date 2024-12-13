const Friend = require("../models/friend");
const User = require("../models/user");
const mongoose = require("mongoose");

// Send a Friend Request
const sendFriendReq = async (req, res) => {
  try {
    const { friendId, username } = req.body;
    let userToAdd;

    if (friendId) {
      userToAdd = await User.findById(friendId);
    } else if (username) {
      userToAdd = await User.findOne({ username: username.trim() });
    }

    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingReq = await Friend.findOne({
      $or: [
        { user: req.user.id, friend: userToAdd._id },
        { user: userToAdd._id, friend: req.user.id },
      ],
    });

    if (existingReq) {
      return res.status(400).json({
        message: "Friend request or friendship already exists",
      });
    }

    await Friend.create({
      user: req.user.id,
      friend: userToAdd._id,
      status: "pending",
    });

    res.json({ message: "Friend request sent successfully!" });
  } catch (err) {
    console.error("Error sending friend request:", err);
    res.status(500).json({
      error: "Error sending friend request",
    });
  }
};

// Accept a Friend Request
const acceptFriendReq = async (req, res) => {
  try {
    const { requestId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: "Invalid Friend Request ID" });
    }

    const friendReq = await Friend.findById(requestId);

    if (!friendReq || friendReq.friend.toString() !== req.user.id) {
      return res.status(404).json({
        message: "Friend request not found or unauthorized",
      });
    }

    friendReq.status = "accepted";
    await friendReq.save();

    await Friend.create([
      { user: req.user.id, friend: friendReq.user, status: "accepted" },
      { user: friendReq.user, friend: req.user.id, status: "accepted" },
    ]);

    res.json({ message: "Friend request accepted!" });
  } catch (err) {
    console.error("Error accepting friend request:", err);
    res.status(500).json({ error: "Error accepting friend request" });
  }
};

// Get Friends List
const getFriends = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).send("User not authenticated");
    }

    const friendships = await Friend.find({
      $or: [
        { user: req.user.id, status: "pending" },
        { friend: req.user.id, status: "pending" },
        { user: req.user.id, status: "accepted" },
        { friend: req.user.id, status: "accepted" },
      ],
    })
      .populate("user", "username email")
      .populate("friend", "username email");

    const acceptedFriends = friendships
      .filter((friendship) => {
        return (
          (friendship.status === "accepted" &&
            friendship.user._id.toString() === req.user.id &&
            friendship.friend._id.toString() !== req.user.id) ||
          (friendship.status === "accepted" &&
            friendship.friend._id.toString() === req.user.id &&
            friendship.user._id.toString() !== req.user.id)
        );
      })
      .map((friendship) => {
        if (friendship.user._id.toString() === req.user.id) {
          return friendship.friend;
        } else {
          return friendship.user;
        }
      });

    const uniqueAcceptedFriends = Array.from(
      new Set(acceptedFriends.map((friend) => friend._id.toString()))
    ).map((id) =>
      acceptedFriends.find((friend) => friend._id.toString() === id)
    );

    const pendingReceivedRequests = friendships.filter(
      (friend) =>
        friend.status === "pending" &&
        friend.friend._id.toString() === req.user.id
    );

    const sentRequests = friendships.filter(
      (friend) =>
        friend.status === "pending" &&
        friend.user._id.toString() === req.user.id
    );

    res.json({
      acceptedFriends: uniqueAcceptedFriends,
      pendingReceivedRequests,
      sentRequests,
    });
  } catch (err) {
    console.error("Error fetching friends list:", err);
    res.status(500).send("Error fetching friends list");
  }
};

// Remove a Friend
const removeFriends = async (req, res) => {
  try {
    const { friendId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid Friend ID" });
    }

    const result = await Friend.findOneAndDelete({
      $or: [
        { user: req.user.id, friend: friendId },
        { user: friendId, friend: req.user.id },
      ],
      status: "accepted",
    });

    if (!result) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    res.json({ message: "Friend removed successfully!" });
  } catch (err) {
    console.error("Error removing friend:", err);
    res.status(500).json({ error: "Error removing friend" });
  }
};

module.exports = {
  sendFriendReq,
  acceptFriendReq,
  getFriends,
  removeFriends,
};
