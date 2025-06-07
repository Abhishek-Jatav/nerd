"use client";

import GoogleLoginButton from "./component/GoogleLoginButton";
import SearchMech from "./component/SearchMech";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />

      {/* Google Login Button - Top Right */}
      <div className="absolute top-4 right-4 sm:right-6">
        <GoogleLoginButton />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl text-center space-y-6 sm:space-y-8 py-8 sm:py-12 px-2 sm:px-4">
        <h1 className="text-4xl xs:text-5xl sm:text-6xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          NERD
        </h1>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg px-2">
          Enter details below and get urResources.
        </p>

        <div className="rounded-2xl bg-white/5 backdrop-blur-md p-4 sm:p-6 shadow-md transition-all w-full">
          <SearchMech />
        </div>
      </div>
    </div>
  );
}
