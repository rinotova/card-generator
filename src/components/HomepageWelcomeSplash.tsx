import { signIn, useSession } from "next-auth/react";
import React from "react";
import Heading from "./Layout/Heading";
import Link from "next/link";

function HomepageWelcomeSplash() {
  const { data: session } = useSession();
  const signInHandler = () => {
    void signIn("google");
  };
  return (
    <div className="flex h-screen flex-col items-center text-white">
      <Heading>Business cards generator</Heading>
      <div className="-mt-24 flex h-full flex-col items-center justify-center space-y-10">
        <h1 className="border-2 border-red-600 p-10 font-bold tracking-widest shadow-lg md:text-6xl">
          &gt; Step 1: Make a digital business card
        </h1>
        <h1 className="border-2 border-red-600 p-10 font-bold tracking-widest shadow-lg md:text-6xl">
          &gt; Step 2: Save the world!
        </h1>
        {!session && (
          <button
            onClick={signInHandler}
            className="mt-8 rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
          >
            Sign in with Google
          </button>
        )}
        {session && (
          <Link
            href="makeCard"
            className="mt-8 rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
          >
            Make a card
          </Link>
        )}
      </div>
    </div>
  );
}

export default HomepageWelcomeSplash;
