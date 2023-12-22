import Home from "pages/Pages/home/Home";
import { Route, Routes } from "react-router";
import { NotFound } from "../pages/Errors/NotFound";

export const routes = (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
