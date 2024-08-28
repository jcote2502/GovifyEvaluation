import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // on refresh check if there is a token
    // or go to login
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (!admin) {
                try {
                    const response = await fetch(`http://localhost:3001/api/admin/user/${token}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        throw new Error("Token expired or invalid");
                    }

                    const data = await response.json();
                    setAdmin(data.admin);
                    setError(null);
                } catch (err) {
                    console.warn(err);
                    localStorage.removeItem("token");
                    setAdmin(null);
                    navigate("/");
                }
            }

        }
        fetchData();
    }, [error]);

    const signup = async (email, password) => {
        try {
            const response = await fetch("http://localhost:3001/api/admin/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to register");
            }

            localStorage.setItem("token", data.token);
            setAdmin(data.admin);
            setError(null);
            navigate('/jobs');
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:3001/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to login");
            }

            localStorage.setItem("token", data.token);
            setAdmin(data.admin);
            setError(null);
            navigate("/jobs");
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            await fetch("http://localhost:3001/api/admin/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
                },
            });

            // Clear token and admin state
            localStorage.removeItem("token");
            setAdmin(null);
            setError(null);
            navigate("/"); // Redirect to login page
        } catch (err) {
            setError(err.message); // Set error message if there's an issue
            console.error(err);
        }
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem("token"); // Check if token exists
    };

    return (
        <AuthContext.Provider value={{ signup, login, logout, admin, error, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};
