"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SignInPage from "./SignInPage";

const IndexPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard"); // Redirect to dashboard if authenticated
    }
  }, [session, status]);

  return (
    <div>
      <SignInPage />
    </div>
  );
};

export default IndexPage;
