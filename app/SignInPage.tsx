"use client";

import { signIn } from "next-auth/react";
import GoogleButton from "react-google-button";

const SignInPage = () => {
  const handleSignIn = () => {
    signIn("google");
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex-1 max-w-lg border-red-500 border-2">
        <h1>Sign In</h1>
        <GoogleButton onClick={handleSignIn} />
      </div>
    </div>
  );
};

export default SignInPage;
