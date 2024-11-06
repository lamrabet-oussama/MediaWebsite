import { useState, lazy, Suspense } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage.jsx"));
const Sidebar = lazy(() => import("./components/common/Sidebar.jsx"));
const RightPanel = lazy(() => import("./components/common/RightPanel.jsx"));
const NotificationPage = lazy(
  () => "./pages/notification/NotificationPage.jsx"
);

// Chargement différé (lazy) des pages
const HomePage = lazy(() => import("./pages/home/HomePage.jsx"));
const SignUpPage = lazy(() => import("./pages/auth/signup/SignUpPage.jsx"));
const LoginPage = lazy(() => import("./pages/auth/login/LogInPage.jsx"));

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="">
        <Suspense fallback={<div>Loading...</div>}>
          <Sidebar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Routes>
          <RightPanel />
        </Suspense>
      </div>
    </>
  );
}

export default App;
