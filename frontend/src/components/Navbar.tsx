import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/Authstore";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <nav
      className="navbar navbar-dark bg-dark border-bottom border-secondary"
      data-bs-theme="dark"
    >
      <div className="container-fluid px-3 px-md-4 d-flex align-items-center">
        {/* Brand */}
        <Link
          className="navbar-brand fw-semibold text-white"
          to={user ? "/app" : "/"}
        >
          <span style={{ letterSpacing: "0.5px" }}>SocialNet</span>
        </Link>

        {/* Right button */}
        <div className="ms-auto">
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-sm btn-outline-danger px-3"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/signin"
              className="btn btn-sm btn-outline-primary px-3"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
