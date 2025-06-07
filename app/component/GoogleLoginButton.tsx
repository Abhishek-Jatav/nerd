"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";
import Image from "next/image";
import toast from "react-hot-toast";
import { auth, provider, database } from "@/lib/firebase";

export default function GoogleLoginButton() {
  const router = useRouter();

  const [authUser, setAuthUser] = useState<{
    uid: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const checkAndSetUser = async (user: any) => {
    try {
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      const authData = {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };

      if (snapshot.exists()) {
        setAuthUser(authData);
      } else {
        const filteredParams = Object.entries(authData)
          .filter(([_, v]) => v != null)
          .reduce((acc, [k, v]) => {
            acc[k] = v as string;
            return acc;
          }, {} as Record<string, string>);

        const params = new URLSearchParams(filteredParams);
        router.push(`/signup?${params.toString()}`);
      }
    } catch (error) {
      console.error("User check error:", error);
      toast.error("Error checking user data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await checkAndSetUser(user);
      } else {
        setAuthUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      provider.setCustomParameters({ prompt: "select_account" }); // force account chooser
      await signInWithPopup(auth, provider);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Google login failed.");
    }
  };

  const onClickProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="relative">
      {loading ? (
        <p className="text-sm text-gray-400">Checking user...</p>
      ) : authUser ? (
        <div
          className="flex items-center space-x-3 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg truncate
          max-w-xs sm:max-w-sm md:max-w-md text-sm sm:text-base">
          <p className="font-medium truncate">{authUser.name}</p>
          {authUser.avatar && (
            <div
              onClick={onClickProfile}
              className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              role="button"
              tabIndex={0}>
              <Image
                src={authUser.avatar}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-white"
              />
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all text-sm sm:text-base">
          Login with Google
        </button>
      )}
    </div>
  );
}
