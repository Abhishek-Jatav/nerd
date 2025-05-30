"use client";

import { useEffect, useState } from "react";
import { database } from "../../lib/firebase"; // Adjust the path as necessary
import { ref, get } from "firebase/database";

interface Material {
  id: string;
  contributerId: string;
  title: string;
  timestamp: number;
}

export default function MaterialList() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const materialsRef = ref(database, "materials");
        const snapshot = await get(materialsRef);
        const data = snapshot.val();

        console.log("Fetched materials:", data); // Debug log

        if (data) {
          const materialsArray: Material[] = Object.entries(data).map(
            ([id, material]: [string, any]) => ({
              id,
              contributerId: material.contributerId || "",
              title: material.title || "",
              timestamp: material.timestamp || 0,
            })
          );

          // Sort by timestamp (latest first)
          materialsArray.sort((a, b) => b.timestamp - a.timestamp);

          setMaterials(materialsArray);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Materials List (Latest First)</h1>

      {loading ? (
        <p>Loading materials...</p>
      ) : materials.length === 0 ? (
        <p>No materials found.</p>
      ) : (
        <ul className="space-y-4">
          {materials.map((material) => (
            <li
              key={material.id}
              className="border p-4 rounded-lg shadow-sm ">
              <p>
                <strong>ID:</strong> {material.id}
              </p>
              <p>
                <strong>Contributer ID:</strong> {material.contributerId}
              </p>
              <p>
                <strong>Title:</strong> {material.title}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
