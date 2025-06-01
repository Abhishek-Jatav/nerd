"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GoogleLoginButton from "./component/GoogleLoginButton";
import SearchMech from "./component/SearchMech";

interface AuthUser {
  uid: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

export default function Home() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        });
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      {/* Google Login Button - Top Right */}
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <GoogleLoginButton />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8 py-8 sm:py-12">
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          NERD
        </h1>

        <p className="text-gray-400 text-base sm:text-lg px-2">
          Enter details below and get urResouces.
        </p>

        {/* Search section - AuthUser passed as prop */}
        <div className="rounded-2xl bg-white/5 backdrop-blur p-4 sm:p-6 shadow-md transition-all">
          <SearchMech authUser={authUser} />
        </div>
      </div>
    </div>
  );
}
