// src/components/Auth/AuthCheck.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserExists } from "../../services/auth";

const AuthCheck = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const userExists = await checkUserExists();
        if (userExists) {
          navigate("/login");
        } else {
          navigate("/register");
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return null;
};

export default AuthCheck;
