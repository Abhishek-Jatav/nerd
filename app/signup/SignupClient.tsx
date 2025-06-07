"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [uid, setUid] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contribution] = useState("0");

  useEffect(() => {
    const u = searchParams.get("uid");
    const n = searchParams.get("name");
    const e = searchParams.get("email");
    const a = searchParams.get("avatar");

    if (!u) {
      toast.error("Missing UID. Redirecting...");
      router.push("/");
      return;
    }

    setUid(u);
    setName(n || "");
    setEmail(e || "");
    setAvatar(a || null);
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      toast.error("User already exists.");
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
        phoneNumber,
        contribution,
        timestamp: new Date().toISOString(),
      });

      toast.success("Signup successful!");
      router.push("/");
    } catch (err) {
      console.error("Error saving user:", err);
      toast.error("Failed to save user data.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-md p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Complete Signup
        </h1>

        {avatar && (
          <div className="flex justify-center mb-6">
            <Image
              src={avatar}
              alt="User Avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-600 object-cover"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-gray-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-white"
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
              className="w-full px-3 py-2 bg-gray-700 rounded-md border border-gray-600 text-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md font-semibold text-white">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
