"use client";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useContext } from "react";
import { AuthenticationContext } from "../context/AuthContext";

import AuthModal from "./AuthModal";

export default function NavBar() {
  const { data, loading } = useContext(AuthenticationContext);
  const { signout } = useAuth();
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        OpenTable
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <button
                className="bg-blue-400 text-white border p-2 px-4 rounded"
                onClick={signout}
              >
                Signout
              </button>
            ) : (
              <>
                <AuthModal isSignin={true} />
                <AuthModal isSignin={false} />
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
