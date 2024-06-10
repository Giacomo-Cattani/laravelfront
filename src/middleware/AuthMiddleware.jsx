import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthMiddleware = ({ children }) => {
    const { token, setToken } = useContext(AuthContext);
    const location = useLocation();

    if (!token) {
        // Redirect to the login page if no token is present
        return <Navigate to="/" replace state={{ from: location }} />;
    }
    // Render the children if the token is present
    return children;
};

export default AuthMiddleware;
