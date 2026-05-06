"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LandingPage } from "@/components/LandingPage";
import { Login } from "@/components/Login";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const { status } = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (status === "authenticated") {
    return <LoadingScreen message="Redirecting to dashboard..." />;
  }

  if (showLogin) {
    return <Login onLogin={() => router.push("/dashboard")} onBack={() => setShowLogin(false)} />;
  }

  return <LandingPage onLoginClick={() => setShowLogin(true)} onGetStarted={() => setShowLogin(true)} />;
}
