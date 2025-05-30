"use client";

import { useEffect, useState } from "react";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, provider, database } from "@/lib/firebase";

export default function GoogleLoginButton() {
  const [showMenu, setShowMenu] = useState(false);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
  const [authUser, setAuthUser] = useState<{
    uid: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  } | null>(null);

  const router = useRouter();

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
      }
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const onClickProfile = () => {
    const user = auth.currentUser;
    if (user) {
      router.push(`/profile?uid=${user.uid}`);
    }
  };

  return (
    <div className="space-y-4 flex flex-col items-center justify-center h-screen">
      {authUser ? (
        <div className="p-4 border rounded shadow bg-gray-50 text-gray-900">
          <p>
            <strong>Name:</strong> {authUser.name}
          </p>

          {/* Avatar + Dropdown */}
          {authUser.avatar && (
            <div
              className="relative inline-block"
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => {
                setShowMenu(false);
                setConfirmingLogout(false);
              }}>
              {/* Avatar Clickable */}
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

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border rounded-md shadow-lg z-50 p-2 w-36">
                  {!confirmingLogout ? (
                    <>
                      <div
                        onClick={onClickProfile}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Profile
                      </div>
                      <div
                        onClick={() => setConfirmingLogout(true)}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                        Logout
                      </div>
                    </>
                  ) : (
                    <div className="px-2 py-1 text-sm">
                      <p className="mb-1">Confirm logout?</p>
                      <div className="flex justify-between">
                        <div
                          onClick={handleLogout}
                          role="button"
                          tabIndex={0}
                          className="text-green-600 cursor-pointer hover:underline">
                          Yes
                        </div>
                        <div
                          onClick={() => setConfirmingLogout(false)}
                          role="button"
                          tabIndex={0}
                          className="text-gray-600 cursor-pointer hover:underline">
                          No
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign in with Google
        </button>
      )}
    </div>
  );
}
