import { signIn, useSession } from "next-auth/react";
import React from "react";

function HomepageWelcomeSplash() {
  const { data: session } = useSession();
  const signInHandler = () => {
    void signIn("google", { callbackUrl: "/makeCard" });
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <h1>Welcome to your Business Card generator</h1>
      {!session && (
        <button
          onClick={signInHandler}
          className="mt-8 rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
}

export default HomepageWelcomeSplash;
