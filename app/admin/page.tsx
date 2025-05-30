"use client";

import { useEffect, useState } from "react";
import { ref, get, set, remove, onValue } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, database } from "../../lib/firebase";
import AddMaterial from "../component/AddMaterial";
import ManageMaterial from "../component/ManageMaterial";
import ManageUser from "../component/ManageUser";
import UserList from "../component/UserList";
import MaterialList from "../component/MaterialList";

const AdminManagement = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [searchResult, setSearchResult] = useState<null | boolean>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        // Always allow super admin
        if (user.email === "abhidel44@gmail.com") {
          setIsAdmin(true);
          return;
        }

        const adminRef = ref(database, "admins");
        onValue(adminRef, (snapshot) => {
          const admins = snapshot.val() || {};
          const key = user.email?.replace(/\./g, "_");
          if (key && admins[key]) {
            setIsAdmin(true);
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  if (!isAdmin) {
    return (
      <div className="p-6 text-red-500 font-semibold text-center bg-gray-900 min-h-screen">
        🚫 Access Denied
      </div>
    );
  }

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
    <div className="bg-gray-900 text-white min-h-screen px-4 py-6">
      <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-center text-white">
          Admin Management
        </h2>

        {currentUser && (
          <p className="mb-4 text-center text-gray-400">
            Logged in as: {currentUser.email}
          </p>
        )}

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

      <div className="mt-10 space-y-6">
        <section className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Material Management</h3>
          <AddMaterial />
          <ManageMaterial />
          <MaterialList />
        </section>

        <section className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <ManageUser />
          <UserList />
        </section>
      </div>
    </div>
  );
};

export default AdminManagement;
