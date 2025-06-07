"use client";

import { useEffect, useState } from "react";
import { database } from "../../lib/firebase";
import { ref, get } from "firebase/database";
import toast from "react-hot-toast";

interface Material {
  id: string;
  contributorId: string;
  contributorName: string;
  title: string;
  verifiedAt: number;
  fileUrl: string;
}

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsRef = ref(database, "verified_contributions"); // Correct path
        const snapshot = await get(materialsRef);
        const data = snapshot.val();

        if (data) {
          const materialsArray: Material[] = Object.entries(data).map(
            ([id, material]: [string, any]) => ({
              id,
              contributorId: material.contributorId || "",
              contributorName: material.contributorName || "",
              title: material.title || "",
              verifiedAt: material.verifiedAt || 0,
              fileUrl: material.fileUrl || "",
            })
          );

          // Sort descending by verifiedAt timestamp
          materialsArray.sort((a, b) => b.verifiedAt - a.verifiedAt);
          setMaterials(materialsArray);
        } else {
          toast("ℹ️ No materials found.");
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
        toast.error("⚠️ Failed to fetch materials.");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto text-white">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Materials List (Latest First)
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading materials...</p>
      ) : materials.length === 0 ? (
        <p className="text-center text-gray-400">No materials found.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li
              key={material.id}
              className="border border-gray-600 bg-gray-800 p-4 rounded-lg shadow-sm">
              <p className="text-sm sm:text-base">
                <strong>ID:</strong> {material.id}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Contributor ID:</strong> {material.contributorId}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Contributor Name:</strong> {material.contributorName}
              </p>
              <p className="text-sm sm:text-base">
                <strong>Title:</strong> {material.title}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {material.verifiedAt
                  ? new Date(material.verifiedAt).toLocaleString()
                  : "No verified timestamp"}
              </p>
              {material.fileUrl && (
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm mt-2 inline-block">
                  View PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
