"use client";

import { useEffect, useState } from "react";
import {
  ref as dbRef,
  onValue,
  remove,
  push,
  set,
  serverTimestamp,
} from "firebase/database";
import { database } from "@/lib/firebase";

interface VerifiedContribution {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  contributorId: string;
  contributorName: string;
  type: string;
  verifiedAt: number;
}

const VerifiedContributionsEditor = () => {
  const [verified, setVerified] = useState<VerifiedContribution[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const refVerified = dbRef(database, "verified_contributions");
    onValue(refVerified, (snapshot) => {
      const data = snapshot.val();
      const loaded: VerifiedContribution[] = [];

      if (data) {
        Object.entries(data).forEach(([key, value]: any) => {
          loaded.push({ id: key, ...value });
        });
      }

      setVerified(loaded.reverse());
    });
  }, []);

  const startEdit = (item: VerifiedContribution) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setTags("");
  };

  const handleFinalize = async (item: VerifiedContribution) => {
    if (!title || !description || !tags) {
      alert("❌ All fields required.");
      return;
    }

    try {
      const newRef = push(dbRef(database, "materials"));
      await set(newRef, {
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
        contributerId: item.contributorId,
        pdfUrl: item.fileUrl,
        timestamp: serverTimestamp(),
      });

      await remove(dbRef(database, `verified_contributions/${item.id}`));
      alert("✅ Finalized and pushed to materials.");
      setEditingId(null);
      setTitle("");
      setDescription("");
      setTags("");
    } catch (err) {
      console.error(err);
      alert("⚠️ Error finalizing material.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Verified Contributions Editor</h2>

      {verified.length === 0 ? (
        <p className="text-gray-500">No verified contributions to finalize.</p>
      ) : (
        <ul className="space-y-6">
          {verified.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg shadow-sm">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs mt-1">👤 {item.contributorName}</p>

              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-2">
                View File
              </a>

              {editingId === item.id ? (
                <div className="mt-4 space-y-2">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={() => handleFinalize(item)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    ✅ Finalize Upload
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEdit(item)}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">
                  ✏️ Edit & Finalize
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VerifiedContributionsEditor;
