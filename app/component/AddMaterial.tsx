"use client";

import { useState, useRef } from "react";
import { ref, push, set, serverTimestamp } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../../lib/firebase"; // Removed 'auth' import

const AddMaterial = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [contributerId, setContributerId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!title || !description || !tags || !contributerId || !file) {
      alert("❌ Please fill all fields and select a PDF file.");
      return;
    }

    setLoading(true);

    try {
      // Upload PDF to Firebase Storage
      const storagePath = `materials/${Date.now()}_${file.name}`;
      const fileRef = storageRef(storage, storagePath);
      await uploadBytes(fileRef, file);
      const pdfUrl = await getDownloadURL(fileRef);

      // Save metadata to Realtime Database
      const newMaterialRef = push(ref(database, "materials"));
      await set(newMaterialRef, {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()),
        contributerId,
        pdfUrl,
        timestamp: serverTimestamp(),
      });

      alert("✅ Material added successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setContributerId("");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error uploading material.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow max-w-xl mx-auto ">
      <h2 className="text-xl font-bold mb-4">Section 2: Add Material (PDF)</h2>

      <input
        type="text"
        placeholder="Title"
        className="mb-2 w-full p-2 border rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Description"
        className="mb-2 w-full p-2 border rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Tags (comma separated)"
        className="mb-2 w-full p-2 border rounded"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        type="text"
        placeholder="Contributor ID"
        className="mb-2 w-full p-2 border rounded"
        value={contributerId}
        onChange={(e) => setContributerId(e.target.value)}
      />

      <input
        type="file"
        accept=".pdf"
        className="mb-2 w-full bg green-50 p-2 border rounded"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      {file && (
        <p className="text-sm mb-2 text-white-700">📄 Selected: {file.name}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}>
        {loading ? "Uploading..." : "Add Material"}
      </button>
    </div>
  );
};

export default AddMaterial;
