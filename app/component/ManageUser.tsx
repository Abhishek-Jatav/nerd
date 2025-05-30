"use client";

import { useState } from "react";
import { ref as dbRef, get, remove } from "firebase/database";
import { database } from "../../lib/firebase";

const ManageUser = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userId.trim()) return;
    setLoading(true);

    try {
      const snap = await get(dbRef(database, `users/${userId}`));
      if (snap.exists()) {
        setUserData(snap.val());
      } else {
        setUserData(null);
        alert("User not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userId || !userData) return;
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await remove(dbRef(database, `users/${userId}`));
      alert("User deleted successfully.");
      setUserId("");
      setUserData(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting user.");
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Section 4: Manage User by ID</h2>

      <input
        type="text"
        placeholder="Enter User ID"
        className="mb-2 w-full p-2 border rounded"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {loading ? "Searching..." : "Search User"}
      </button>

      {userData && (
        <div className="mt-4 border p-4 rounded ">
          <p>
            <strong>Name:</strong> {userData.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || "N/A"}
          </p>
          <p>
            <strong>Registered:</strong>
            {userData.timeStamp
              ? new Date(userData.timeStamp).toLocaleString()
              : "N/A"}
          </p>

          <button
            onClick={handleDelete}
            className="bg-red-600 text-white mt-4 px-4 py-2 rounded">
            Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
