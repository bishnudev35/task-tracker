import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./component/(auth)/signup";
import LoginPage from "./component/(auth)/login";
import DashboardPage from "./component/dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async () => {
    const longTermToken = localStorage.getItem("longTermToken");
    
    if (!longTermToken) {
      setLoggedIn(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://task-tracker-uwol.onrender.com/api/v1/valid?longTermToken=${longTermToken}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      if (data.message === "Token is valid") {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        localStorage.removeItem("longTermToken");
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      setLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  // This function will be passed to SignupPage to update auth state after signup
  const handleSuccessfulAuth = () => {
    setLoggedIn(true);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/register" element={
          loggedIn ? 
            <Navigate replace to="/" /> : 
            <SignupPage onAuthSuccess={handleSuccessfulAuth} />
        } />
        <Route path="/login" element={
          loggedIn ? 
            <Navigate replace to="/" /> : 
            <LoginPage onAuthSuccess={handleSuccessfulAuth} />
        } />
        <Route
          path="/"
          element={loggedIn ? <DashboardPage /> : <Navigate replace to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;