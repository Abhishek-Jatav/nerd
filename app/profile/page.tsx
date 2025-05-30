import { Suspense } from "react";
import UserProfileClientWrapper from "./UserProfileClient";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UserProfileClientWrapper />
    </Suspense>
  );
}
