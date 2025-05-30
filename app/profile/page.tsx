"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { database } from "../../lib/firebase";
import { ref, get } from "firebase/database";
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

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const searchParams = useSearchParams();
  const userUid = searchParams.get("uid");

  useEffect(() => {
    if (userUid) {
      const userRef = ref(database, `users/${userUid}`);
      get(userRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log("User not found.");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user data:", error);
        });
    }
  }, [userUid]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 px-4 py-10">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">
          👤 User Profile
        </h1>

        {userData ? (
          <div className="space-y-10">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center space-y-4">
              <img
                src={userData.avatar}
                alt="User Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-700 shadow-md"
              />
              <div className="text-center">
                <h2 className="text-2xl font-semibold">{userData.name}</h2>
                <p className="text-gray-400 text-sm">{userData.email}</p>
              </div>
            </div>

            {/* Detailed Info */}
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

            {/* Contribute Form */}
            <section className="mt-10 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">
                📤 Upload Contribution
              </h3>
              <Contribute userUid={userUid!} userData={userData} />
            </section>

            {/* Contributions List */}
            <section className="mt-10 border-t border-gray-700 pt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">
                📚 Your Contributions
              </h3>
              <UserContributions userUid={userUid!} userData={userData} />
            </section>
          </div>
        ) : (
          <p className="text-center text-gray-400">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
