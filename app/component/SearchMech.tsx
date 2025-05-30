"use client";

import { useState, useEffect } from "react";
import { database } from "../../lib/firebase"; // adjust the path if needed
import { ref, onValue } from "firebase/database";

// Type definition for a material item
interface Material {
  id: string;
  title: string;
  tags: string[];
  pdfUrl?: string;
  [key: string]: any; // Allow any other optional properties
}

const SearchMech = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);

  // Fetch all materials on component mount
  useEffect(() => {
    const materialsRef = ref(database, "materials");

    const unsubscribe = onValue(materialsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setAllMaterials([]);
        return;
      }

      const materials: Material[] = Object.entries(data).map(([id, value]) => {
        const val = value as Omit<Material, "id">;
        return {
          id,
          title: val.title || "Untitled",
          tags: Array.isArray(val.tags) ? val.tags : [],
          pdfUrl: val.pdfUrl || "",
          ...val, // Include any other fields
        };
      });

      setAllMaterials(materials);
    });

    return () => {
      // Cleanup the Firebase listener when component unmounts
      unsubscribe();
    };
  }, []);

  // Filter materials by tag based on search term
  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();

    const filtered = allMaterials.filter(
      (material) =>
        Array.isArray(material.tags) &&
        material.tags.some((tag) => tag.toLowerCase().startsWith(lower))
    );

    setFilteredMaterials(filtered);
  }, [searchTerm, allMaterials]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <input
        type="text"
        placeholder="Search by tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="mt-6 space-y-4">
        {searchTerm ? (
          filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="p-4 border rounded-xl shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{material.title}</h2>
                  {material.pdfUrl && (
                    <a
                      href={material.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline">
                      View
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap gap-2">
                  {material.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 px-2 py-0.5 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              No matching materials found.
            </p>
          )
        ) : null}
      </div>
    </div>
  );
};

export default SearchMech;
