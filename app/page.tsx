"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import GoogleLoginButton from "./component/GoogleLoginButton";
import SearchMech from "./component/SearchMech";


export default function Home() {
  interface AuthUser {
    uid: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  }

  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const authData = {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        };
        setAuthUser(authData);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-950 text-white relative px-4 flex items-center justify-center">
      {/* Google Login Icon - Top Right */}
      <div className="absolute right-4">
        <div
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all cursor-pointer"
          title="Login with Google">
          <GoogleLoginButton />
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          NERD
        </h1>

        <p className="text-gray-400 text-lg">
          Enter details below and get urResouces.
        </p>

        {/* Pass authUser as prop */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-purple-800/20 transition-all">
          <SearchMech authUser={authUser} />
        </div>
      </div>
    </div>
  );
}
