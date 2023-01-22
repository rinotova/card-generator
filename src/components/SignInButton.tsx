import { signIn, signOut, useSession } from "next-auth/react";

function SessionButton() {
  const { data: session } = useSession();
  const signInHandler = () => {
    void signIn("google");
  };
  const signOutHandler = () => {
    void signOut();
  };
  const buttonMessage = session ? "Sign out" : "Sign in with Google";

  return (
    <button
      onClick={session ? signOutHandler : signInHandler}
      className="h-12 w-44 rounded bg-red-800 text-sm text-white hover:bg-red-900"
    >
      {buttonMessage}
    </button>
  );
}

export default SessionButton;
