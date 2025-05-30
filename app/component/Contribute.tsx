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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfLink || !description || !pdfTitle) {
      setStatus("Please fill in all fields.");
      return;
    }

    const templateParams = {
      user_uid: userUid,
      user_email: userData.email,
      user_name: userData.name,
      material_title: pdfTitle,
      material_description: description,
      material_drive_link: pdfLink,
    };

    try {
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      console.log(result.text);
      setStatus("Upload successfully!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      setStatus("Upload failed: " + error.text || error.message);
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default Contribute;
