"use client";

import { useState } from "react";
import { ref as dbRef, get, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { database, storage } from "../../lib/firebase";

const ManageMaterial = () => {
  const [materialId, setMaterialId] = useState("");
  const [materialData, setMaterialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!materialId.trim()) return;
    setLoading(true);

    try {
      const snap = await get(dbRef(database, `materials/${materialId}`));
      if (snap.exists()) {
        setMaterialData(snap.val());
      } else {
        setMaterialData(null);
        alert("Material not found.");
      }
    } catch (err) {
      console.error(err);
      alert("Error searching material.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!materialId || !materialData) return;
    const confirmDelete = confirm(
      "Are you sure you want to delete this material?"
    );
    if (!confirmDelete) return;

    try {
      // Delete the PDF from storage
      const fileUrl = materialData.pdfUrl;
      const path = decodeURIComponent(
        new URL(fileUrl).pathname.split("/o/")[1].split("?")[0]
      );
      const fileRef = storageRef(storage, path);
      await deleteObject(fileRef);

      // Delete the material from the database
      await remove(dbRef(database, `materials/${materialId}`));

      alert("Material deleted successfully.");
      setMaterialId("");
      setMaterialData(null);
    } catch (err) {
      console.error(err);
      alert("Error deleting material.");
    }
  };

  return (
    <div className="p-4 border rounded-xl shadow max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">
        Section 3: Manage Material by ID
      </h2>

      <input
        type="text"
        placeholder="Enter Material ID"
        className="mb-2 w-full p-2 border rounded"
        value={materialId}
        onChange={(e) => setMaterialId(e.target.value)}
      />
      <button
        onClick={handleSearch}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        {loading ? "Searching..." : "Search Material"}
      </button>

      {materialData && (
        <div className="mt-4 border p-4 rounded bg-gray-100">
          <h3 className="font-semibold text-lg">{materialData.title}</h3>
          <p className="text-sm text-gray-600 mb-2">
            {materialData.description}
          </p>
          <p>
            <strong>Tags:</strong> {materialData.tags.join(", ")}
          </p>
          <p>
            <strong>Contributor ID:</strong> {materialData.contributerId}
          </p>
          <a
            href={materialData.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline block mt-2">
            View PDF
          </a>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white mt-4 px-4 py-2 rounded">
            Delete Material
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageMaterial;
