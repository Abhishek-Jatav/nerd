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

interface Contribution {
  id: string;
  title: string;
  description: string;
  contributorId: string;
  contributorName: string;
  fileUrl: string;
  type: string;
  timestamp: number;
}

const AdminReviewPanel = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);

  useEffect(() => {
    const contribRef = dbRef(database, "unverified_contributions");
    onValue(contribRef, (snapshot) => {
      const data = snapshot.val();
      const loaded: Contribution[] = [];

      if (data) {
        Object.entries(data).forEach(([key, value]: any) => {
          loaded.push({ id: key, ...value });
        });
      }

      setContributions(loaded.reverse());
    });
  }, []);

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("❌ Are you sure you want to delete this?");
    if (!confirm) return;

    try {
      await remove(dbRef(database, `unverified_contributions/${id}`));
      alert("✅ Deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to delete.");
    }
  };

  const handleVerify = async (contribution: Contribution) => {
    try {
      const newRef = push(dbRef(database, "verified_contributions"));
      await set(newRef, {
        ...contribution,
        verifiedAt: serverTimestamp(),
      });
      await remove(
        dbRef(database, `unverified_contributions/${contribution.id}`)
      );
      alert("✅ Verified and moved to verified_contributions.");
    } catch (err) {
      console.error(err);
      alert("⚠️ Failed to verify contribution.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Admin Panel: Review Submissions
      </h2>

      {contributions.length === 0 ? (
        <p className="text-gray-500">No new contributions to review.</p>
      ) : (
        <ul className="space-y-6">
          {contributions.map((item) => (
            <li key={item.id} className="p-4 border rounded-lg shadow-sm">
              <p className="text-lg font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="text-xs mt-1">👤 {item.contributorName}</p>

              <div className="flex items-center gap-2 mt-3">
                <a
                  href={item.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline">
                  View File
                </a>

                <button
                  onClick={() => handleVerify(item)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded">
                  ✅ Verify
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                  🗑️ Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminReviewPanel;
