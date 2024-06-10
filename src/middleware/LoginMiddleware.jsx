import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AuthMiddleware = ({ children }) => {
    const { token } = useContext(AuthContext);
    const location = useLocation();

    if (location.pathname === "/" && token) {
        return <Navigate to="/user" replace state={{ from: location }} />;
    }

    // Render the children if the token is present
    return children;
};

export default AuthMiddleware;
