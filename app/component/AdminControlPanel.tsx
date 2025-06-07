"use client";

import { useState } from "react";
import { ref, get, set, remove } from "firebase/database";
import { database } from "../../lib/firebase";
import toast from "react-hot-toast";

const AdminControlPanel = () => {
  const [emailInput, setEmailInput] = useState("");
  const [searchResult, setSearchResult] = useState<null | boolean>(null);

  const handleAddAdmin = async () => {
    if (!emailInput) {
      toast.error("⚠️ Please enter an email.");
      return;
    }

    try {
      const key = emailInput.replace(/\./g, "_");
      await set(ref(database, `admins/${key}`), true);
      toast.success("✅ Admin added successfully.");
      setEmailInput("");
      setSearchResult(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to add admin.");
    }
  };

  const handleSearchAdmin = async () => {
    if (!emailInput) {
      toast.error("⚠️ Please enter an email.");
      return;
    }

    try {
      const key = emailInput.replace(/\./g, "_");
      const snap = await get(ref(database, `admins/${key}`));
      setSearchResult(snap.exists());
    } catch (error) {
      console.error(error);
      toast.error("❌ Error searching admin.");
    }
  };

  const handleRemoveAdmin = async () => {
    if (!emailInput) {
      toast.error("⚠️ Please enter an email.");
      return;
    }

    try {
      const key = emailInput.replace(/\./g, "_");
      await remove(ref(database, `admins/${key}`));
      toast.success("🗑️ Admin removed successfully.");
      setEmailInput("");
      setSearchResult(null);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to remove admin.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-xl w-full mx-auto bg-gray-800 rounded-lg shadow-md text-white space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">
        Admin Management (Super Admin Only)
      </h2>

      <input
        type="email"
        placeholder="Enter admin email"
        className="w-full px-4 py-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />

      <div className="flex flex-wrap gap-3 justify-center mt-2">
        <button
          onClick={handleAddAdmin}
          className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded shadow">
          ➕ Add Admin
        </button>
        <button
          onClick={handleSearchAdmin}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded shadow">
          🔍 Search Admin
        </button>
        <button
          onClick={handleRemoveAdmin}
          className="bg-red-600 hover:bg-red-700 transition text-white px-4 py-2 rounded shadow">
          ❌ Remove Admin
        </button>
      </div>

      {searchResult !== null && (
        <p
          className={`mt-3 text-center font-medium ${
            searchResult ? "text-green-400" : "text-red-400"
          }`}>
          {searchResult ? "✅ Admin Found" : "❌ Admin Not Found"}
        </p>
      )}
    </div>
  );
};

export default AdminControlPanel;
