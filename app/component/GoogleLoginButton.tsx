"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import Image from "next/image";
import { auth, provider, database } from "@/lib/firebase";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<{
    uid: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const authData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        };
        setAuthUser(authData);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const authData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      setAuthUser(authData);

      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        const params = new URLSearchParams(authData as Record<string, string>);
        router.push(`/signup?${params}`);
        // User not found in DB → Logout after short delay
        setTimeout(() => {
          signOut(auth).catch((err) => console.error("Logout failed:", err));
          setAuthUser(null);
        }, 500);
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const onClickProfile = () => {
    router.push("/profile"); // Just route to /profile, use auth context or state inside that page
  };

  return (
    <div className="h-screen">
      {authUser ? (
        <div className="text-white flex items-center justify-between space-x-4">
          <p>
            <strong>{authUser.name}</strong>
          </p>
          {authUser.avatar && (
            <div className="inline-block">
              <div
                onClick={onClickProfile}
                className="cursor-pointer mt-2"
                role="button"
                tabIndex={0}>
                <Image
                  src={authUser.avatar}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="rounded-full"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Login
        </button>
      )}
    </div>
  );
}
