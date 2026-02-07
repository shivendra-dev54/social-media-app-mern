import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/Authstore";
import { useState } from "react";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/signin");
  };

  return (
    <nav
      className="navbar navbar-dark border-bottom border-left border-right border-secondary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-white" to="/">
          SocialNet
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-md-0 gap-md-2 align-items-md-center">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/app">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-light ms-md-2"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="btn btn-info" to="/signin">
                    Sign In
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="btn btn-info ms-md-2"
                    to="/signup"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
