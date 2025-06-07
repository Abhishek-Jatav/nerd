"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, database } from "../../lib/firebase";

import SearchMaterial from "../component/SearchMaterial";
import ManageUser from "../component/ManageUser";
import MaterialList from "../component/MaterialList";
import AdminControlPanel from "../component/AdminControlPanel";
import AdminContributionManager from "../component/AdminContributionManager";

const AdminManagement = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);

        if (user.email === "abhidel44@gmail.com") {
          setIsAdmin(true);
          setIsSuperAdmin(true);
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

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 py-6">
      {currentUser && (
        <p className="mb-6 text-center text-gray-400">
          Logged in as: {currentUser.email}
        </p>
      )}

      {isSuperAdmin && <AdminControlPanel />}

      <div className="mt-10 space-y-6">
        <section className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">Material Management</h3>
          <AdminContributionManager/>
          <SearchMaterial />
          <MaterialList />
        </section>

        <section className="bg-gray-800 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">User Management</h3>
          <ManageUser />
          {/* <UserList /> */}
        </section>
      </div>
    </div>
  );
};

export default AdminManagement;
