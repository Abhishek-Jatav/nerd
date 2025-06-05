"use client";

import { useState, useRef } from "react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "@/lib/firebase"; // ✅ adjust path if needed
import { ref, push, set, serverTimestamp } from "firebase/database";

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
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !description || !title) {
      setStatus("❌ All fields are required.");
      return;
    }

    try {
      setIsUploading(true);

      // Upload file to Firebase Storage
      const path = `uploads/${userUid}_${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      // Save initial data to unverified_contributions
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

      setStatus("✅ Uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
      setStatus("⚠️ Upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-xl shadow-md  text-white">
      <h2 className="text-xl font-bold mb-4">Contribute Material</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border text-white rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 text-white border rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
          required
        />
        {file && (
          <p className="text-sm text-gray-700">📁 Selected: {file.name}</p>
        )}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 rounded ${
            isUploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}>
          {isUploading ? "Uploading..." : "Upload"}
        </button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </div>
  );
};

export default ContributeUpload;
