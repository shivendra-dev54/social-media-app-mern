import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/Authstore";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SigninPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!result.status) {
        toast.error(result.message);
        return;
      }
      console.log(result.data);
      setUser(result.data);
      toast.success(result.message);
      navigate("/app");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="d-flex align-items-center justify-content-center min-vh-100 bg-black text-light px-3"
      data-bs-theme="dark"
    >
      <form
        onSubmit={handleSignin}
        className="w-100 p-4 rounded-4 border border-secondary"
        style={{
          maxWidth: 420,
          backgroundColor: "#111317",
        }}
      >
        <h2 className="mb-4 text-center fw-semibold text-primary">
          Sign In
        </h2>

        <div className="mb-3">
          <input
            type="email"
            className="form-control form-control-lg bg-black text-light border-secondary"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control form-control-lg bg-black text-light border-secondary"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-lg w-100 mt-3"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-4 text-center text-secondary">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-primary text-decoration-none">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
};
