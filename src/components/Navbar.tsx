import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signInWithGoogle, signOut, user } = useAuth();

  const displayName =
    user?.user_metadata.user_name || user?.user_metadata.name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-40 bg-white/90 backdrop-blur-lg border-b border-emerald-100 shadow-lg">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            onClick={() => {
              if (window.location.pathname === "/") {
                window.location.reload();
              }
            }}
            className="font-mono text-xl font-bold text-emerald-700"
          >
            IFMA TIMON<span className="text-emerald-500">.TESES</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={() => {
                if (window.location.pathname === "/") {
                  window.location.reload();
                }
              }}
              className="text-emerald-700 hover:text-emerald-500 transition-colors"
            >
              Início
            </Link>
            <Link
              to="/create"
              className="text-emerald-700 hover:text-emerald-500 transition-colors"
            >
              Publicar TCC/Artigo
            </Link>
            <Link
              to="/communities"
              className="text-emerald-700 hover:text-emerald-500 transition-colors"
            >
              Artigos por curso
            </Link>
            <Link
              to="/myprojects"
              className="text-emerald-700 hover:text-emerald-500 transition-colors"
            >
              Meus trabalhos
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                {user.user_metadata?.picture && (
                  <img
                    src={user.user_metadata.picture}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                  />
                )}
                <span className="text-emerald-700">{displayName}</span>
                <button
                  onClick={signOut}
                  className="bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-500"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-emerald-600 text-white hover:bg-emerald-500 px-3 py-1 rounded"
              >
                Entrar com o Google
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-emerald-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 border-t border-emerald-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:text-emerald-500 hover:bg-emerald-50"
            >
              Início
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:text-emerald-500 hover:bg-emerald-50"
            >
              Publicar TCC/Artigo
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-md text-base font-medium text-emerald-700 hover:text-emerald-500 hover:bg-emerald-50"
            >
              Artigos por curso
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
