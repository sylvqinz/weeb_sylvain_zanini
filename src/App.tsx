import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import ScrollTop from "./components/scrollTop";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import ConfirmEmailChange from "./pages/ConfirmEmailChange";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CreateArticle from "./pages/CreateArticle";
import Account from "./pages/Account";
import AccountSettings from "./pages/AccountSettings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="bg-[#0f172a] text-white">
      <ScrollTop />
      <Header />

      <main className="pt-[136px] min-h-screen">
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/confirm-email-change" element={<ConfirmEmailChange />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/articles/new" element={<CreateArticle />} />
            <Route path="/articles/:slug/edit" element={<CreateArticle />} />
            <Route path="/account" element={<Account />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ProtectedRoute>
      </main>
      <Footer />
    </div>
  );
}

export default App;
