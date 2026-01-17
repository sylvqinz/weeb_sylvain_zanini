import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll && currentScroll > 100) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }

      setLastScroll(currentScroll);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed w-full flex justify-center lg:pt-5 z-50 transition-transform duration-450 ${
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
            <li>
              <Link to="/about" className="hover:text-white transition">
                Qui sommes-nous ?
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
          <Link to="/login" className="text-[16px] text-neutral-300 hover:text-white transition">
            Se connecter
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-[8px] text-[16px] font-semibold text-white
              bg-gradient-to-r from-purple-500 to-purple-700
              hover:from-purple-400 hover:to-purple-600
              shadow-lg shadow-purple-600/30
              transition inline-flex items-center justify-center"
          >
            S'inscrire
          </Link>
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
          <li>
            <Link to="/about" className="hover:text-white transition block" onClick={closeMenu}>
              Qui sommes-nous ?
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-white transition block" onClick={closeMenu}>
              Contact
            </Link>
          </li>
          <li className="border-t border-gray-700 pt-6">
            <Link to="/login" className="hover:text-white transition block" onClick={closeMenu}>
              Se connecter
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="px-5 py-3 rounded-[8px] text-[16px] font-semibold text-white
                bg-gradient-to-r from-purple-500 to-purple-700
                hover:from-purple-400 hover:to-purple-600
                shadow-lg shadow-purple-600/30
                transition block text-center"
              onClick={closeMenu}
            >
              S'inscrire
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
