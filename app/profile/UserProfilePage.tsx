"use client";

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { auth, database } from "../../lib/firebase";
import Contribute from "../component/Contribute";
import UserContributions from "../component/UserContributions";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  collegeName: string;
  dateOfBirth: string;
  gender: string;
}

export default function UserProfileClientWrapper() {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}`);
        try {
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log("User not found in database.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        router.push("/"); // redirect if user not logged in
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          👤 User Profile
        </h1>

        {userData ? (
          <div className="space-y-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-700 shadow-md">
                <Image
                  src={userData.avatar}
                  alt="User Avatar"
                  fill
                  sizes="112px"
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{userData.name}</h2>
                <p className="text-gray-400 text-sm">{userData.email}</p>
              </div>

              <div className="text-center mt-4">
                {confirmLogout ? (
                  <div className="space-x-4">
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                      Yes, Logout
                    </button>
                    <button
                      onClick={() => setConfirmLogout(false)}
                      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmLogout(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition mt-2">
                    Logout
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-700/50 backdrop-blur-md p-5 rounded-xl shadow transition hover:shadow-lg">
                <p className="text-sm text-gray-400">Gender</p>
                <p className="text-lg font-medium">{userData.gender}</p>
              </div>
              <div className="bg-gray-700/50 backdrop-blur-md p-5 rounded-xl shadow transition hover:shadow-lg">
                <p className="text-sm text-gray-400">Date of Birth</p>
                <p className="text-lg font-medium">{userData.dateOfBirth}</p>
              </div>
              <div className="sm:col-span-2 bg-gray-700/50 backdrop-blur-md p-5 rounded-xl shadow transition hover:shadow-lg">
                <p className="text-sm text-gray-400">College</p>
                <p className="text-lg font-medium">{userData.collegeName}</p>
              </div>
            </div>

            <section className="mt-10 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">
                📤 Upload Contribution
              </h3>
              <Contribute userUid={userData.uid} userData={userData} />
            </section>
{/* 
            <section className="mt-10 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">
                📚 Your Contributions
              </h3>
              <UserContributions userUid={userData.uid} userData={userData} />
            </section> */}
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading user data...</p>
        )}
      </div>
    </div>
  );
}
