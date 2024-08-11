import React from "react";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import AppointmentList from "./components/Appointments/AppointmentList";
import AppointmentForm from "./components/Appointments/AppointmentForm";
import UserList from "./components/Users/UserList";
import LoginForm from "./components/Auth/login";
import RegistrationForm from "./components/Auth/Register";
import Layout from "./Layout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <UserList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <AppointmentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-appointment"
        element={
          <ProtectedRoute>
            <AppointmentForm />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
