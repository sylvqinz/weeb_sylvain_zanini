import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isAdminUser } from "../lib/auth";
import Button from "./Button";

export default function Header() {
  const navigate = useNavigate();
  const { authenticated, logout, user } = useAuth();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const lastScrollRef = useRef(0);
  const canAccessAdmin = isAdminUser(user);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScrollRef.current && currentScroll > 100) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }

      lastScrollRef.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    closeMenu();
    navigate("/login");
    setLoggingOut(false);
  };

  return (
    <header
      className={`fixed w-full flex justify-center lg:pt-5 z-50 transition-transform duration-[450ms] ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav
        className="relative flex items-center justify-between h-[96px] w-[1000px] max-w-6xl px-8 py-4 lg:rounded-[20px]
          bg-[#19202f]"
        style={{
          boxShadow: "0px 0px 15px 0px #00000012, 0px 25px 50px -12px #00000040",
        }}
      >
        <div className="flex items-center gap-10">
          <Link to="/" className="text-[32px] font-bold tracking-wide" onClick={closeMenu}>
            weeb
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-[16px] text-neutral-300">
            {/* <li>
              <Link to="/about" className="hover:text-white transition">
                Qui sommes-nous ?
              </Link>
            </li> */}
            <li>
              <Link to="/blog" className="hover:text-white transition">
                Blog
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {authenticated ? (
            <>
              {canAccessAdmin && (
                <Link to="/admin" className="text-[16px] text-neutral-300 hover:text-white transition">
                  Admin
                </Link>
              )}
              <Link to="/account" className="text-[16px] text-neutral-300 hover:text-white transition">
                Mon compte
              </Link>
              <Button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                variant="gradient"
                className="text-[16px] font-semibold"
              >
                {loggingOut ? "Déconnexion..." : "Se déconnecter"}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-[16px] text-neutral-300 hover:text-white transition">
                Se connecter
              </Link>

              <Button
                to="/signup"
                variant="gradient"
                className="text-[16px] font-semibold"
              >
                S'inscrire
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 justify-center items-center z-50"
          aria-label="Menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      <div
        className={`md:hidden fixed top-[136px] left-0 right-0 bg-[#19202f] mx-4 rounded-[20px] shadow-2xl transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          boxShadow: menuOpen ? "0px 0px 15px 0px #00000012, 0px 25px 50px -12px #00000040" : "none",
        }}
      >
        <ul className="flex flex-col gap-6 p-8 text-[16px] text-neutral-300">
          {/* <li>
            <Link to="/about" className="hover:text-white transition block" onClick={closeMenu}>
              Qui sommes-nous ?
            </Link>
          </li> */}
          <li>
            <Link to="/contact" className="hover:text-white transition block" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-white transition block" onClick={closeMenu}>
              Blog
            </Link>
          </li>
          {authenticated ? (
            <>
              <li className="border-t border-gray-700 pt-6">
                {canAccessAdmin && (
                  <Link to="/admin" className="mb-6 hover:text-white transition block" onClick={closeMenu}>
                    Admin
                  </Link>
                )}
                <Link to="/account" className="hover:text-white transition block" onClick={closeMenu}>
                  Mon compte
                </Link>
              </li>
              <li>
                <Button
                  type="button"
                  disabled={loggingOut}
                  variant="gradient"
                  className="w-full py-3 text-[16px] font-semibold"
                  onClick={handleLogout}
                >
                  {loggingOut ? "Déconnexion..." : "Se déconnecter"}
                </Button>
              </li>
            </>
          ) : (
            <>
              <li className="border-t border-gray-700 pt-6">
                <Link to="/login" className="hover:text-white transition block" onClick={closeMenu}>
                  Se connecter
                </Link>
              </li>
              <li>
                <Button
                  to="/signup"
                  variant="gradient"
                  className="w-full py-3 text-[16px] font-semibold"
                  onClick={closeMenu}
                >
                  S'inscrire
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}
