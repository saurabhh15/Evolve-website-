import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/get-started";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default MainLayout;