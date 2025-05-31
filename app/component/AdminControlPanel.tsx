"use client";

import { useState } from "react";
import { ref, get, set, remove } from "firebase/database";
import { database } from "../../lib/firebase";

const AdminControlPanel = () => {
  const [emailInput, setEmailInput] = useState("");
  const [searchResult, setSearchResult] = useState<null | boolean>(null);

  const handleAddAdmin = async () => {
    if (!emailInput) return;
    const key = emailInput.replace(/\./g, "_");
    await set(ref(database, `admins/${key}`), true);
    alert("✅ Admin added.");
    setEmailInput("");
    setSearchResult(null);
  };

  const handleSearchAdmin = async () => {
    if (!emailInput) return;
    const key = emailInput.replace(/\./g, "_");
    const snap = await get(ref(database, `admins/${key}`));
    setSearchResult(snap.exists());
  };

  const handleRemoveAdmin = async () => {
    if (!emailInput) return;
    const key = emailInput.replace(/\./g, "_");
    await remove(ref(database, `admins/${key}`));
    alert("🗑️ Admin removed.");
    setEmailInput("");
    setSearchResult(null);
  };

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-center text-white">
        Admin Management (Super Admin Only)
      </h2>

      <input
        type="email"
        placeholder="Enter admin email"
        className="w-full mb-4 px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />

      <div className="flex flex-wrap gap-3 justify-center">
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
        <p className="mt-4 text-center font-medium">
          {searchResult ? "✅ Admin Found" : "❌ Admin Not Found"}
        </p>
      )}
    </div>
  );
};

export default AdminControlPanel;
