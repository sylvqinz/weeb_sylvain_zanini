import { Route, Routes } from "react-router-dom";
import AdminRoute from "../components/AdminRoute";
import ProtectedRoute from "../components/ProtectedRoute";
import Account from "../pages/Account";
import AccountSettings from "../pages/AccountSettings";
import AdminDashboard from "../pages/AdminDashboard";
import Blog from "../pages/Blog";
import BlogDetail from "../pages/BlogDetail";
import ConfirmEmailChange from "../pages/ConfirmEmailChange";
import Contact from "../pages/Contact";
import CreateArticle from "../pages/CreateArticle";
import Home from "../pages/Home";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import ResetPassword from "../pages/ResetPassword";
import Signup from "../pages/Signup";

export default function AppRoutes() {
  return (
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
  );
}
