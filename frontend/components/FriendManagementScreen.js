import axios from "axios";
import { useState, useEffect } from "react";

const FriendManagement = () => {
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [error, setError] = useState(null);

  const getFriends = async () => {
    try {
      const response = await axios.get("/api/friends");
      setFriends(response.data.acceptedFriends);
      setPendingRequests(response.data.pendingFriends);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching friends");
    }
  };

  const sendFriendRequest = async (friendId, username) => {
    try {
      const data = friendId ? { friendId } : { username };
      const response = await axios.post("/api/friends/request", data);
      alert(response.data.message);
      getFriends(); // Refresh the friend list
    } catch (err) {
      setError(err.response?.data?.message || "Error sending friend request");
    }
  };

  const acceptFriendRequest = async (requestId) => {
    try {
      const response = await axios.put(`/api/friends/accept/${requestId}`);
      alert(response.data.message);
      getFriends(); // Refresh the friend list
    } catch (err) {
      setError(err.response?.data?.message || "Error accepting friend request");
    }
  };

  const removeFriend = async (friendId) => {
    try {
      const response = await axios.delete(`/api/friends/${friendId}`);
      alert(response.data.message);
      getFriends(); // Refresh the friend list
    } catch (err) {
      setError(err.response?.data?.message || "Error removing friend");
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/api/friends/add");
      setAllUsers(response.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching users");
    }
  };

  useEffect(() => {
    getFriends();
    getAllUsers();
  }, []);

  return (
    <div>
      <h1>Friend Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend._id}>
            {friend.username} ({friend.email})
            <button onClick={() => removeFriend(friend._id)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>Pending Requests</h2>
      <ul>
        {pendingRequests.map((req) => (
          <li key={req._id}>
            {req.username} ({req.email})
            <button onClick={() => acceptFriendRequest(req._id)}>Accept</button>
          </li>
        ))}
      </ul>

      <h2>Add Friend</h2>
      <ul>
        {allUsers.map((user) => (
          <li key={user._id}>
            {user.username} ({user.email})
            <button onClick={() => sendFriendRequest(user._id)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendManagement;
