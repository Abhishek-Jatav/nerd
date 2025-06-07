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
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../../lib/firebase";
import toast from "react-hot-toast";

interface UnverifiedContribution {
  id: string;
  title: string;
  description: string;
  contributorId: string;
  contributorName: string;
  fileUrl: string;
  type: string;
  timestamp: number;
}

const AdminContributionManager = () => {
  const [unverified, setUnverified] = useState<UnverifiedContribution[]>([]);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    const unsubscribe = onValue(
      dbRef(database, "unverified_contributions"),
      (snapshot) => {
        const data = snapshot.val();
        const loaded: UnverifiedContribution[] = [];
        if (data) {
          Object.entries(data).forEach(([key, value]: any) => {
            loaded.push({ id: key, ...value });
          });
        }
        setUnverified(loaded.reverse());
      }
    );

    return () => unsubscribe();
  }, []);

  const getStoragePathFromUrl = (url: string): string | null => {
    const match = decodeURIComponent(url).match(/o\/(.*?)\?alt=media/);
    return match ? match[1] : null;
  };

  const handleReject = async (item: UnverifiedContribution) => {
    const confirmReject = window.confirm(
      "⚠️ Are you sure you want to reject and delete this contribution?"
    );
    if (!confirmReject) return;

    try {
      await remove(dbRef(database, `unverified_contributions/${item.id}`));

      const path = getStoragePathFromUrl(item.fileUrl);
      if (path) {
        const fileRef = storageRef(storage, path);
        await deleteObject(fileRef);
      }

      toast.success("🗑️ Rejected and deleted successfully.");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error deleting the contribution.");
    }
  };

  const startVerifying = (item: UnverifiedContribution) => {
    setVerifyingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setTags("");
  };

  const handleVerify = async (item: UnverifiedContribution) => {
    if (!title || !description || !tags) {
      toast.error("❗ All fields are required for verification.");
      return;
    }

    try {
      const newRef = push(dbRef(database, "verified_contributions"));
      await set(newRef, {
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()),
        contributorId: item.contributorId,
        contributorName: item.contributorName,
        fileUrl: item.fileUrl,
        type: item.type,
        verifiedAt: serverTimestamp(),
      });

      await remove(dbRef(database, `unverified_contributions/${item.id}`));

      toast.success("✅ Verified and moved successfully.");
      setVerifyingId(null);
      setTitle("");
      setDescription("");
      setTags("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to verify and move.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center">
        Admin Panel: Review Submissions
      </h2>

      {unverified.length === 0 ? (
        <p className="text-gray-400 text-center">
          No unverified contributions available.
        </p>
      ) : (
        <ul className="space-y-6">
          {unverified.map((item) => (
            <li
              key={item.id}
              className="p-4 sm:p-6 border rounded-xl shadow-md bg-white dark:bg-gray-800 text-black dark:text-white space-y-2">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {item.description}
              </p>
              <p className="text-xs text-gray-500">👤 {item.contributorName}</p>

              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline block mt-2">
                📄 View File
              </a>

              {verifyingId === item.id ? (
                <div className="mt-4 space-y-3">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleVerify(item)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                      ✅ Confirm Verify
                    </button>
                    <button
                      onClick={() => setVerifyingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded">
                      ✖ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => startVerifying(item)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                    ✅ Verify
                  </button>
                  <button
                    onClick={() => handleReject(item)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                    ❌ Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminContributionManager;
