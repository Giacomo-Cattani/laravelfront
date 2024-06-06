// src/context/AuthContext.js
import { createContext, useEffect, useState } from 'react';
import { useJwt } from "react-jwt";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [data, setData] = useState({ decodedToken: null, isExpired: false });
    const { decodedToken, isExpired, reEvaluateToken } = useJwt(token);

    function resetToken(tempToken) {
        return new Promise((resolve) => {
            reEvaluateToken(tempToken);
            resolve();
        });
    }

    useEffect(() => {
        if (token === null) {
            setToken(null);
            localStorage.removeItem('token');
        } else {
            reEvaluateToken(token)
        }
    }, [token]);

    useEffect(() => {
        if (isExpired) {
            setToken(null);
            localStorage.removeItem('token');
            return;
        }
        setData({ decodedToken, isExpired });
    }, [decodedToken, isExpired]);

    return (
        <AuthContext.Provider value={{ token, data, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthContextProvider };
