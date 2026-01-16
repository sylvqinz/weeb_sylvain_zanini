import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import ScrollTop from "./components/scrollTop";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

function App() {
  return (
    <div className="bg-[#0f172a] text-white">
      <ScrollTop />
      <Header />

      <main className="pt-[136px] min-h-screen">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
