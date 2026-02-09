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
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/50 shadow-lg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to={user ? "/app" : "/"}
            className="group flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
              <span className="text-white font-bold text-sm">SF</span>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
              SocialFlow
            </span>
          </Link>

          {/* Right button */}
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span className="hidden md:block text-slate-400 text-sm">
                  Welcome, <span className="text-blue-400 font-semibold">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/signin"
                className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/50 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};