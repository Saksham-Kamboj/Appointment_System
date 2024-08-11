import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FaTrashCan } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";

const AppointmentList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/appointments");
      // console.log(response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const fetchUserDetails = useCallback(async (userIds) => {
    try {
      const response = await api.post("/users/batch", { userIds });
      const newUserDetails = response.data.reduce((acc, user) => {
        acc[user._id] = user;
        return acc;
      }, {});
      setUserDetails((prev) => ({ ...prev, ...newUserDetails }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      const userIdsToFetch = appointments.map((appointment) =>
        user.role === "Student"
          ? appointment.teacher_id
          : appointment.student_id
      );
      fetchUserDetails(userIdsToFetch);
    }
  }, [appointments, user.role, fetchUserDetails]);

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/updateStatus`, { status });
      fetchAppointments();
      toast.success(`Appointment ${status.toLowerCase()} successfully!`);
    } catch (error) {
      toast.error(`Error ${status.toLowerCase()} appointment!`);
      console.error(`Error ${status.toLowerCase()} appointment:`, error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      fetchAppointments();
      toast.success("Appointment deleted successfully!");
    } catch (error) {
      toast.error("Error deleting appointment!");
      console.error("Error deleting appointment:", error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString(
      "en-IN",
      options
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600">
          <h2 className="text-2xl font-bold text-white">Appointments</h2>
        </div>
        {appointments.length === 0 ? (
          <div className="px-6 py-4">
            <p className="text-gray-700">No appointments found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li
                key={appointment._id}
                className="px-6 py-4 hover:bg-gray-50 transition duration-150 ease-in-out flex items-center justify-between"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      Date: {formatDate(appointment.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Time: {formatTime(appointment.time)}
                    </p>
                    {user && user.role === "Student" && (
                      <p className="text-sm text-gray-700">
                        Teacher:{" "}
                        {userDetails[appointment.teacher_id]?.name ||
                          "Loading..."}
                      </p>
                    )}
                    {user && user.role === "Teacher" && (
                      <p className="text-sm text-gray-700">
                        Student:{" "}
                        {userDetails[appointment.student_id]?.name ||
                          "Loading..."}
                      </p>
                    )}
                    <p className="mt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                  {user && user.role === "Student" && (
                    <button
                      onClick={() => deleteAppointment(appointment._id)}
                      className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FaTrashCan />
                    </button>
                  )}
                </div>
                {user &&
                  user.role === "Teacher" &&
                  appointment.status === "Pending" && (
                    <div className="mt-2">
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "Confirmed")
                        }
                        className="mb-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() =>
                          updateAppointmentStatus(appointment._id, "Rejected")
                        }
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
