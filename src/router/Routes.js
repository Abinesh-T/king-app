import Home from "pages/Pages/home/Home";
import { Outlet, Route, Routes } from "react-router";
import { NotFound } from "../pages/Errors/NotFound";
import Party from "pages/Pages/Party/Party";
import Item from "pages/Pages/Item/Item";
import Order from "pages/Pages/Order/Order";
import Rate from "pages/Pages/Rate/Rate";
import Login from "pages/Pages/auth/Login";
import Restricted from "pages/Errors/Restricted";
import App from "App";
import { ProtectedRoutes } from "./ProtectedRoute";

export const routes = (
  <Routes>
    <Route element={<ProtectedRoutes />}>
      <Route path="/restricted" element={<Restricted />} />
      <Route path="/" element={<Home />} />
      <Route path="/rate" element={<Rate />} />
      <Route path="/order" element={<Order />} />
      <Route path="/item" element={<Item />} />
      <Route path="/party" element={<Party />} />
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
