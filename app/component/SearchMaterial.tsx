"use client";

import { useState } from "react";
import { ref as dbRef, get, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../../lib/firebase";
import toast from "react-hot-toast";

const SearchMaterial = () => {
  const [materialId, setMaterialId] = useState("");
  const [materialData, setMaterialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSearch = async () => {
    if (!materialId.trim()) {
      toast.error("Please enter a Material ID.");
      return;
    }
    setLoading(true);

    try {
      const snap = await get(
        dbRef(database, `verified_contribution/${materialId}`)
      );
      if (snap.exists()) {
        setMaterialData(snap.val());
      } else {
        setMaterialData(null);
        toast.error("Material not found.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error searching material.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!materialId || !materialData) return;

    // Custom confirm using toast
    const confirm = await new Promise<boolean>((resolve) => {
      const id = toast(
        (t) => (
          <div className="flex flex-col">
            <p className="mb-3">
              Are you sure you want to delete this material?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => {
                  toast.dismiss(id);
                  resolve(false);
                }}>
                Cancel
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => {
                  toast.dismiss(id);
                  resolve(true);
                }}>
                Delete
              </button>
            </div>
          </div>
        ),
        { duration: Infinity, position: "top-center" }
      );
    });

    if (!confirm) return;

    setDeleting(true);
    try {
      // Delete the file from storage
      const fileUrl = materialData.pdfUrl;
      const path = decodeURIComponent(
        new URL(fileUrl).pathname.split("/o/")[1].split("?")[0]
      );
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);

      // Delete from database
      await remove(dbRef(database, `verified_contribution/${materialId}`));

      toast.success("Material deleted successfully.");
      setMaterialId("");
      setMaterialData(null);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting material.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        Section 3: Manage Material by ID
      </h2>

      <input
        type="text"
        placeholder="Enter Material ID"
        className="mb-3 w-full p-3 rounded border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className={`w-full py-3 rounded text-white ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}>
        {loading ? "Searching..." : "Search Material"}
      </button>

      {materialData && (
        <div className="mt-6 p-5 bg-gray-800 rounded-lg shadow-md text-white">
          <h3 className="text-xl font-semibold mb-2">{materialData.title}</h3>
          <p className="text-gray-300 mb-3">{materialData.description}</p>
          <p className="mb-1">
            <strong>Tags:</strong>{" "}
            {Array.isArray(materialData.tags)
              ? materialData.tags.join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>Contributor ID:</strong>{" "}
            {materialData.contributerId || "N/A"}
          </p>
          <a
            href={materialData.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline mt-3 inline-block">
            View PDF
          </a>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`mt-5 w-full py-3 rounded text-white ${
              deleting
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}>
            {deleting ? "Deleting..." : "Delete Material"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchMaterial;
