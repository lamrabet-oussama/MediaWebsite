import { useState, lazy, Suspense } from "react";

import ClipLoader from "react-spinners/ClipLoader.js";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage.jsx"));
const Sidebar = lazy(() => import("./components/common/Sidebar.jsx"));
const RightPanel = lazy(() => import("./components/common/RightPanel.jsx"));
const NotificationPage = lazy(() =>
  import("./pages/notification/NotificationPage.jsx")
);

const HomePage = lazy(() => import("./pages/home/HomePage.jsx"));
const SignUpPage = lazy(() => import("./pages/auth/signup/SignUpPage.jsx"));
const LoginPage = lazy(() => import("./pages/auth/login/LogInPage.jsx"));

function App() {
  const {
    data: authUser,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const result = await fetch("/api/auth/me");
      const data = await result.json();
      if (!result.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      return data;
    },
    retry: false,
  });

  // Afficher un toast en cas d'erreur
  if (isError) {
    toast.error(error.message || "Failed to load user data");
  }

  // Affichage du loader pendant le chargement des données utilisateur
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <ClipLoader color="#FAB400" size="50" />
      </div>
    );
  }

  return (
    <>
      <div className="">
        <Suspense
          fallback={
            <div className="h-screen flex justify-center items-center">
              <ClipLoader color="#FAB400" size="50" />
            </div>
          }
        >
          {authUser ? <Sidebar /> : <div></div>}
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route path="/signup" element={<SignUpPage />} />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notifications"
              element={
                authUser ? <NotificationPage /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
          {authUser ? <RightPanel /> : <div></div>}
          <Toaster />
        </Suspense>
      </div>
    </>
  );
}

export default App;
