"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";

interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatar: string;
  collegeName: string;
  dateOfBirth: string;
  gender: string;
}

interface ContributeProps {
  userUid: string;
  userData: UserProfile;
}

const Contribute = ({ userUid, userData }: ContributeProps) => {
  const [pdfLink, setPdfLink] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 🚀 Added state to track submission

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Early return if any field is empty
    if (!pdfLink || !description || !pdfTitle) {
      setStatus("Please fill in all fields.");
      return;
    }

    // ✅ Check environment variables before using
    const serviceID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceID || !templateID || !publicKey) {
      setStatus("Email service not configured properly.");
      return;
    }

    const templateParams = {
      user_uid: userUid,
      user_email: userData?.email,
      user_name: userData?.name,
      material_title: pdfTitle,
      material_description: description,
      material_drive_link: pdfLink,
    };

    setIsSubmitting(true); // ⏳ Disable button during upload

    try {
      const result = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        publicKey
      );

      console.log(result.text);
      setStatus("Upload successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      // ⚠️ Improved error type handling
      const errorMessage = error?.text || error?.message || "Upload failed.";
      setStatus(`Upload failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false); // ✅ Always reset submit state
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload PDF Info</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="PDF Title"
          value={pdfTitle}
          onChange={(e) => setPdfTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="url"
          placeholder="Google Drive PDF Link"
          value={pdfLink}
          onChange={(e) => setPdfLink(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="PDF Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting} // ✅ Disable button during form submission
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {isSubmitting ? "Uploading..." : "Upload"}
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default Contribute;
