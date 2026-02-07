import { Link, useNavigate } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const SignupPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast.success("Account created successfully");
      navigate("/signin");
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
        onSubmit={handleSignup}
        className="w-100 p-4 p-md-5 rounded-4 border border-secondary"
        style={{
          maxWidth: 440,
          backgroundColor: "#111317",
        }}
      >
        <h2 className="mb-2 text-center fw-semibold text-primary">
          Create Account
        </h2>

        <p className="mb-4 text-center text-secondary">
          Get started with SocialFlow
        </p>

        <div className="mb-3">
          <input
            type="text"
            className="form-control form-control-lg bg-black text-light border-secondary"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

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
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-secondary">
          Already have an account?{" "}
          <Link to="/signin" className="text-primary text-decoration-none">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
};
