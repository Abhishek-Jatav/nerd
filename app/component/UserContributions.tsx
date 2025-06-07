"use client";

import React, { useEffect, useState } from "react";
import { database } from "../../lib/firebase"; // adjust path as needed
import { ref, onValue } from "firebase/database";
import toast from "react-hot-toast";

interface Material {
  id: string;
  title: string;
  timestamp: number;
}

interface UserContributionsProps {
  userUid: string;
  userData?: {
    name?: string;
    avatarUrl?: string;
  };
}

const UserContributions: React.FC<UserContributionsProps> = ({
  userUid,
  userData,
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userUid) {
      setMaterials([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const materialsRef = ref(database, "verified_contributions");
    const unsubscribe = onValue(
      materialsRef,
      (snapshot) => {
        const data = snapshot.val();
        const contributions: Material[] = [];

        if (data) {
          Object.entries(data).forEach(([key, value]: any) => {
            if (value.contributerId === userUid) {
              contributions.push({
                id: key,
                title: value.title,
                timestamp: value.timestamp,
              });
            }
          });

          // Sort by timestamp (newest first)
          contributions.sort((a, b) => b.timestamp - a.timestamp);
          if (contributions.length === 0) {
            toast("No contributions found for this user.", { icon: "ℹ️" });
          }
        } else {
          toast("No materials found in database.", { icon: "📂" });
        }

        setMaterials(contributions);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load user contributions.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userUid]);

  return (
    <div className="p-4 rounded shadow max-w-3xl mx-auto bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Contributions by {userData?.name || "User"}
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          Loading contributions...
        </p>
      ) : materials.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No contributions available.
        </p>
      ) : (
        <ul className="space-y-3">
          {materials.map((material) => (
            <li
              key={material.id}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-gray-200 dark:border-gray-700 pb-2">
              <strong className="text-gray-900 dark:text-white truncate max-w-full sm:max-w-[70%]">
                {material.title}
              </strong>
              <span className="text-gray-600 dark:text-gray-400 text-sm mt-1 sm:mt-0">
                {new Date(material.timestamp).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserContributions;
