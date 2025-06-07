"use client";

import { useState, useEffect } from "react";
import { auth, database } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import toast from "react-hot-toast";

interface Material {
  id: string;
  title: string;
  tags: string[];
  fileUrl?: string;
  [key: string]: any;
}

const SearchMech = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [authUser, setAuthUser] = useState<any>(null);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Check if user is registered in DB
  useEffect(() => {
    if (!authUser) return;

    const userRef = ref(database, `users/${authUser.uid}`);
    const unsubscribe = onValue(
      userRef,
      (snapshot) => {
        const exists = snapshot.exists();
        setUserExists(exists);
        if (!exists) {
          toast.error("Access denied. You are not authorized.");
        }
      },
      (error) => {
        console.error("User check error:", error);
        toast.error("Error checking user access.");
      }
    );

    return () => unsubscribe();
  }, [authUser]);

  // Fetch verified materials
  useEffect(() => {
    if (!userExists) return;

    const materialsRef = ref(database, "verified_contributions");

    const unsubscribe = onValue(
      materialsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (!data) {
          setAllMaterials([]);
          toast("No verified materials found.", { icon: "📂" });
          return;
        }

        const materials: Material[] = Object.entries(data).map(
          ([id, value]) => {
            const val = value as Omit<Material, "id">;
            return {
              id,
              title: val.title || "Untitled",
              tags: Array.isArray(val.tags) ? val.tags : [],
              fileUrl: val.fileUrl || "", // <-- fixed here
              ...val,
            };
          }
        );
        setAllMaterials(materials);
      },
      (error) => {
        console.error("Error fetching materials:", error);
        toast.error("Failed to load materials.");
      }
    );

    return () => unsubscribe();
  }, [userExists]);

  // Filter search by tag (startsWith)
  useEffect(() => {
    const lower = searchTerm.trim().toLowerCase();
    if (!lower) {
      setFilteredMaterials([]);
      return;
    }

    const filtered = allMaterials.filter(
      (material) =>
        Array.isArray(material.tags) &&
        material.tags.some((tag) => tag.toLowerCase().startsWith(lower))
    );
    setFilteredMaterials(filtered);
  }, [searchTerm, allMaterials]);

  if (!authUser) {
    return (
      <div className="text-center text-white text-sm sm:text-base mt-8">
        Please login to search for resources.
      </div>
    );
  }

  if (userExists === null) {
    return (
      <div className="text-center text-white text-sm sm:text-base mt-8">
        Checking access permission...
      </div>
    );
  }

  if (!userExists) {
    return (
      <div className="text-center text-red-500 text-sm sm:text-base mt-8">
        Access denied. You are not authorized to use this feature.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <input
        type="text"
        placeholder="Search by tag..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-700 rounded-lg p-3 text-sm sm:text-base
          bg-gray-900 text-gray-200 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label="Search materials by tag"
      />

      <div className="mt-6 space-y-4 min-h-[100px]">
        {searchTerm ? (
          filteredMaterials.length > 0 ? (
            filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="p-4 border border-gray-700 rounded-xl shadow-sm hover:shadow-md
                transition bg-gray-800 text-gray-100">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <h2 className="text-lg font-semibold truncate">
                    {material.title}
                  </h2>
                  {material.fileUrl && (
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline text-sm">
                      View PDF
                    </a>
                  )}
                </div>
                <div className="text-sm text-gray-400 flex flex-wrap gap-2">
                  {material.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 px-2 py-1 rounded-full text-xs truncate max-w-max">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 text-sm">
              No matching materials found.
            </p>
          )
        ) : (
          <p className="text-center text-gray-400 text-sm">
            Start typing to search materials.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchMech;
