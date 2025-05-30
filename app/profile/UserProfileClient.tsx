"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual user profile component with no SSR
const UserProfilePage = dynamic(() => import("./UserProfilePage"), {
  ssr: false,
});

export default function UserProfileClientWrapper() {
  return <UserProfilePage />;
}
