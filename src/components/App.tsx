"use client";
import { useState, useEffect } from "react";
import { supabase, Profile } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import AuthPage from "./AuthPage";
import Onboarding from "./Onboarding";
import Dashboard from "./Dashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
    setLoading(false);
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadProfile(user.id);
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#0a1628",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column", gap: 16,
    }}>
      <div style={{ fontSize: "2.5rem" }}>🌊</div>
      <div style={{ color: "#7a9bc4", fontFamily: "Georgia, serif", fontSize: "1.1rem" }}>
        Loading UrgeStop…
      </div>
    </div>
  );

  if (!user) return <AuthPage />;
  if (!profile?.sobriety_start_date) return <Onboarding user={user} onComplete={refreshProfile} />;
  return <Dashboard user={user} profile={profile} onProfileUpdate={refreshProfile} />;
}
