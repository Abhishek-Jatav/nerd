"use client";

import { useState } from "react";
import { ref as dbRef, get, remove } from "firebase/database";
import { database } from "../../lib/firebase";
import toast from "react-hot-toast";

const ManageUser = () => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a valid User ID");
      return;
    }

    setLoading(true);
    try {
      const snap = await get(dbRef(database, `users/${userId}`));
      if (snap.exists()) {
        setUserData(snap.val());
        toast.success("✅ User found");
      } else {
        setUserData(null);
        toast.error("❌ User not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error fetching user");
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
      toast.success("🗑️ User deleted successfully");
      setUserId("");
      setUserData(null);
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Error deleting user");
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 border rounded-xl shadow max-w-xl w-full mx-auto mt-8 bg-gray-800 text-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Section 4: Manage User by ID
      </h2>

      <input
        type="text"
        placeholder="Enter User ID"
        className="mb-4 w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <button
        onClick={handleSearch}
        disabled={loading}
        className={`w-full py-2 px-4 rounded transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}>
        {loading ? "Searching..." : "🔍 Search User"}
      </button>

      {userData && (
        <div className="mt-6 border border-gray-600 bg-gray-700 p-4 rounded space-y-2">
          <p>
            <strong>Name:</strong> {userData.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {userData.email || "N/A"}
          </p>
          <p>
            <strong>Registered:</strong>{" "}
            {userData.timeStamp
              ? new Date(userData.timeStamp).toLocaleString()
              : "N/A"}
          </p>

          <button
            onClick={handleDelete}
            className="w-full mt-4 py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white transition">
            ❌ Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
