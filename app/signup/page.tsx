"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "@/lib/firebase";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid");
  const nameParam = searchParams.get("name");
  const emailParam = searchParams.get("email");
  const avatar = searchParams.get("avatar");

  const [name, setName] = useState(nameParam || "");
  const [email] = useState(emailParam || ""); // read-only
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [contribution] = useState("0");
  const [alreadyExists, setAlreadyExists] = useState(false);

  useEffect(() => {
    if (uid) {
      const userRef = ref(database, `users/${uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          setAlreadyExists(true);
        }
      });
    }
  }, [uid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      alert("User already exists. No data was saved.");
      return;
    }

    try {
      await set(userRef, {
        uid,
        name,
        email,
        avatar,
        gender,
        dateOfBirth,
        collegeName,
        contribution,
        timestamp: new Date().toISOString(),
      });

      alert("User data saved successfully.");
      router.push("/");
    } catch (error) {
      console.error("Error saving user data:", error);
      alert("Failed to save user data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Complete Signup</h1>

        {avatar && (
          <div className="flex justify-center mb-6">
            <img
              src={avatar}
              alt="User Avatar"
              className="w-20 h-20 rounded-full border-2 border-gray-600 object-cover"
            />
          </div>
        )}

        {alreadyExists ? (
          <p className="text-red-400 text-center font-semibold">
            This user already exists in the database. You cannot sign up again.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Email</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white focus:outline-none"
                required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">College Name</label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Contribution</label>
              <input
                type="text"
                value={contribution}
                readOnly
                className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-gray-400 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md font-semibold text-white">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
