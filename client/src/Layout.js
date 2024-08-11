import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./components/context/AuthContext";
import logo from "./assets/logo.png";

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex-shrink-0">
              <img className="h-10 w-10" src={logo} alt="Logo" />
            </Link>
            <div className="flex items-center">
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/appointments"
                    className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Appointments
                  </Link>
                  {user && user.role !== "Teacher" && (
                    <Link
                      to="/create-appointment"
                      className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Create Appointment
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {user ? (
                  <button
                    onClick={logout}
                    className="text-white bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-white hover:bg-blue-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
