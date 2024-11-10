import { lazy, Suspense } from "react";
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
    isError,
  } = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
        });
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        console.log("authUser is here:", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isError) {
    toast.error("Failed to load user data");
  }

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
            <Route
              path="/signup"
              element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
            />
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
