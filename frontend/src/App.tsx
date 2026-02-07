import { Routes, Route, Navigate } from "react-router";
import { Navbar } from "./components/Navbar";
import { Homepage } from "./Pages/Homepage";
import { SigninPage } from "./Pages/signInPage";
import { SignupPage } from "./Pages/signUpPage";
import Feed from "./Pages/Feed";
import CreatePost from "./Pages/CreatePost";
import { useAuthStore } from "./store/Authstore";
import type { JSX } from "react";
import UpdatePost from "./Pages/UpdatePost";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/signin" />;
}


function App() {

  return (
    <div className="container-fluid">
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/app" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="/app/create" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/app/post/:id/edit" element={
          <ProtectedRoute>
            <UpdatePost />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App;
