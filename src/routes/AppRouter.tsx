import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import PostDetailPage from "../pages/PostDetailPage";

import ProtectedRoute from "../components/layout/ProtectedRoute";

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ color: "white" }}>Cargando...</div>;
  }

  return (
    <Routes>
      {!user && (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {user && (
        <>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/post/:id"
            element={
              <ProtectedRoute>
                <PostDetailPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}