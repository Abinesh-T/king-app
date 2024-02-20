import { Navigate, Outlet } from "react-router-dom";
import React from 'react';

export const useAuth = () => {
    const user = localStorage.getItem("access_token") ? true : false;
    return user;
};

export const ProtectedRoutes = () => {
    const isAuth = useAuth();
    return isAuth ? <Outlet /> : <Navigate to="login" />;
};
