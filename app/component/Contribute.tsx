"use client";

import { useState, useRef } from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "@/lib/firebase";
import { ref, push, set, serverTimestamp } from "firebase/database";
import toast from "react-hot-toast";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  collegeName: string;
  dateOfBirth: string;
  gender: string;
}

interface ContributeProps {
  userUid: string;
  userData: UserProfile;
}

const ContributeUpload = ({ userUid, userData }: ContributeProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !description || !title) {
      toast.error("❌ All fields are required.");
      return;
    }

    try {
      setIsUploading(true);

      const path = `uploads/${userUid}_${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const uploadRef = push(ref(database, "unverified_contributions"));
      await set(uploadRef, {
        title,
        description,
        contributorId: userUid,
        contributorName: userData?.name,
        fileUrl: downloadURL,
        type: file.type,
        timestamp: serverTimestamp(),
      });

      toast.success("✅ Under Verification!");

      setFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("⚠️ Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-10 p-6 rounded-xl shadow-md bg-gray-800 text-white">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Contribute Material
      </h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 h-28 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white file:cursor-pointer"
          required
        />
        {file && (
          <p className="text-sm text-gray-300">📁 Selected: {file.name}</p>
        )}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded transition ${
            isUploading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default ContributeUpload;
