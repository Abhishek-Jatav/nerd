"use client";

import GoogleLoginButton from "./component/GoogleLoginButton";
import SearchMech from "./component/SearchMech";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white relative px-4 flex items-center justify-center">
      {/* Google Login Icon - Top Right */}
      <div className="absolute  right-4">
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full shadow-lg transition-all"
          title="Login with Google">
          <GoogleLoginButton />
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          NERD
        </h1>

        <p className="text-gray-400 text-lg">
          Enter details below and get urResouces.
        </p>

        {/* Search Mechanism */}
        <div className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-purple-800/20 transition-all">
          <SearchMech />
        </div>
      </div>
    </div>
  );
}
