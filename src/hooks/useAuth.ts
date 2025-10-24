"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthUser, AuthState } from "@/types/auth";
import { createClient } from "@/lib/supabase/client";

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("authToken");

        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (teamOrEmail: string, password: string) => {
    try {
      const supabase = createClient();

      // Accept either team name or full email. If email provided, extract team name.
      const teamName = teamOrEmail.includes("@")
        ? teamOrEmail.split("@")[0]
        : teamOrEmail;

      // 1) Check teams table for the team and verify password (teams.pass)
      const { data: team, error: teamError } = await supabase
        .from("teams")
        .select("team_id, team_name, pass")
        .eq("team_name", teamName)
        .single();

      if (teamError || !team) {
        return {
          success: false,
          message: "Team not found",
        };
      }

      if (team.pass !== password) {
        return {
          success: false,
          message: "Invalid password",
        };
      }

      // Build the email we will use for Supabase Auth
      const email = `${teamName}@algovibe.com`;

      // 2) Try to sign in the auth user
      let signInResult = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If sign-in failed because user doesn't exist, create the auth user (signUp) and then sign in
      if (signInResult.error) {
        // Try sign up (this will create a new auth.user)
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signUpError) {
          // If user already exists but sign-in failed for other reason, return error
          console.error("Sign up error:", signUpError);
          return {
            success: false,
            message: signUpError.message || "Authentication failed",
          };
        }

        // If signUp didn't return a session (email confirm flows), try signIn again
        signInResult = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInResult.error) {
          console.error("Sign-in after sign-up failed:", signInResult.error);
          return {
            success: false,
            message:
              signInResult.error.message ||
              "Authentication failed after signup",
          };
        }
      }

      // At this point signInResult should be successful
      const session = signInResult.data.session;  

      const user: AuthUser = {
        id: team.team_id.toString(),
        email,
        team_id: team.team_id,
      };

      // Persist locally
      localStorage.setItem("user", JSON.stringify(user));
      if (session?.access_token) {
        localStorage.setItem("authToken", session.access_token);
      }

      setAuthState({ user, isAuthenticated: true, isLoading: false });

      return { success: true, message: "Login successful", user };
    } catch (error: any) {
      console.error("Login error:", error);
      return { success: false, message: error?.message || "Login failed" };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("authToken");

      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return { success: true, message: "Logout successful" };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Logout failed",
      };
    }
  }, []);

  return {
    ...authState,
    login,
    logout,
  };
};
