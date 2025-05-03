import React from "react";
import { useEffect } from "react";

function Profile() {
  const [user, setUser] = React.useState(null);
  const [loading, setIsLoading] = React.useState(true);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoggedIn(false);
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`https://task-tracker-uwol.onrender.com/api/v1/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'authorization': `${token}`,
            'longtermtoken': `${localStorage.getItem("longTermToken")}`,
          },
        });
        
        const data = await response.json();
        console.log("Response data:", data);
        if(data.user){
          setUser(data.user);
        }
        if (data.message === "Token is valid") {
          console.log("Token is valid");
          setLoggedIn(true);
        } else {
          console.log("Token is invalid or expired");
          setLoggedIn(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, []);

  const handleLogout = async (e) => {
e.preventDefault();
    setLogoutLoading(true);
    try {
      const token = localStorage.getItem("token");
      const longTermToken = localStorage.getItem("longTermToken");
       console.log("Token:", token);
      console.log("Long Term Token:", longTermToken);
      // Send logout request to the server
      const response = await fetch(`https://task-tracker-uwol.onrender.com/api/v1/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'authorization': `${token}`,
          'longtermtoken': `${longTermToken}`,
        },
      });
      console.log(response)
      // Clear local storage regardless of response
    
      // Update state
    
       if(response.ok){
        localStorage.removeItem("token");
        localStorage.removeItem("longTermToken");
        setLoggedIn(false);
        setUser(null);
        window.location.href = "/";
       }
     
      
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear storage even if the server request fails
      localStorage.removeItem("token");
      localStorage.removeItem("longTermToken");
      setLoggedIn(false);
      setUser(null);
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">User Profile</h2>
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
          
          {user ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <span className="text-blue-800 font-semibold text-xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <dl className="divide-y divide-gray-200">
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{user.email}</dd>
                  </div>
                  
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Country</dt>
                    <dd className="text-sm text-gray-900">{user.country || "Not specified"}</dd>
                  </div>
                  
                  <div className="py-3 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Member since</dt>
                    <dd className="text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No user profile available. Please log in again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;