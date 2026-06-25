import { Routes, Route, Navigate } from "react-router-dom";
import  useAuth  from "../hooks/useAuth";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import CreatePostPage from "../pages/CreatePostPage";
import PostDetailPage from "../pages/PostDetailPage";

export default function AppRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="*" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </>
      ) : (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}