import React, { Children, createContext, useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
// import { useNavigate } from "react-router-dom";
import axios from 'axios'

const userContext = createContext()
const AuthContext = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)
  // const navigate = useNavigate()

 useEffect(() => {
  const verifyUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      // navigate("/login");
      return;
    }
    try {
      const response = await axios.post(
        "https://mern-employee-management-system-3.onrender.com/api/auth/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem("token");
        // navigate("/login");
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem("token");
      // navigate("/login");
    } finally {
      setLoading(false);
    }
  };
  verifyUser();
}, []);

  const login = (user) => {
    setUser(user)
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  };

  return <userContext.Provider value={{user, login, logout, loading}}>
    {children}
  </userContext.Provider>;
};

export const useAuth = () => useContext(userContext)
export default AuthContext;
