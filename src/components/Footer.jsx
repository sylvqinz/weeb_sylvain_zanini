import { Link } from "react-router-dom";
import { FaYoutube, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-900 px-8 py-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 flex-grow">
          <div className="flex-shrink-0 font-bold text-2xl mb-8 md:mb-0">weeb</div>
          <div>
            <h4 className="text-xs uppercase text-gray-400 mb-4">Product</h4>

            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/pricing" className="hover:text-purple-600 cursor-pointer">
                Pricing
              </Link>
              <Link to="/overview" className="hover:text-purple-600 cursor-pointer">
                Overview
              </Link>
              <Link to="/browse" className="hover:text-purple-600 cursor-pointer">
                Browse
              </Link>
              <Link to="/accessibility" className="hover:text-purple-600 cursor-pointer">
                Accessibility
              </Link>
              <Link to="/five" className="hover:text-purple-600 cursor-pointer">
                Five
              </Link>
            </nav>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-xs uppercase text-gray-400 mb-4">Solutions</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/brainstorming" className="hover:text-purple-600 cursor-pointer">
                Brainstorming
              </Link>
              <Link to="/ideation" className="hover:text-purple-600 cursor-pointer">
                Ideation
              </Link>
              <Link to="/wireframing" className="hover:text-purple-600 cursor-pointer">
                Wireframing
              </Link>
              <Link to="/research" className="hover:text-purple-600 cursor-pointer">
                Research
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs uppercase text-gray-400 mb-4">Resources</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/help-center" className="hover:text-purple-600 cursor-pointer">
                Help Center
              </Link>
              <Link to="/blog" className="hover:text-purple-600 cursor-pointer">
                Blog
              </Link>
              <Link to="/tutorials" className="hover:text-purple-600 cursor-pointer">
                Tutorials
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs uppercase text-gray-400 mb-4">Company</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link to="/about" className="hover:text-purple-600 cursor-pointer">
                About
              </Link>
              <Link to="/press" className="hover:text-purple-600 cursor-pointer">
                Press
              </Link>
              <Link to="/events" className="hover:text-purple-600 cursor-pointer">
                Events
              </Link>
              <Link to="/careers" className="hover:text-purple-600 cursor-pointer">
                Careers
              </Link>
            </nav>
          </div>
        </div>
      </div>

      <hr className="my-10 border-gray-200" />

      {/* Bottom part */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-6 md:gap-0 text-gray-500 text-sm">
        <p>© 2026 Weeb, Inc. All rights reserved.</p>

        <div className="flex space-x-6 text-gray-900 text-lg">
          <a href="#" aria-label="YouTube" className="hover:text-purple-600 transition">
            <FaYoutube />
          </a>
          <a href="#" aria-label="Facebook" className="hover:text-purple-600 transition">
            <FaFacebookF />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-purple-600 transition">
            <FaTwitter />
          </a>
          <a href="#" aria-label="Instagram" className="hover:text-purple-600 transition">
            <FaInstagram />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-purple-600 transition">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </footer>
  );
}
