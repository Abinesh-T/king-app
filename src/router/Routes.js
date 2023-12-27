import Home from "pages/Pages/home/Home";
import { Route, Routes } from "react-router";
import { NotFound } from "../pages/Errors/NotFound";
import Party from "pages/Pages/Party/Party";
import Item from "pages/Pages/Item/Item";
import Order from "pages/Pages/Order/Order";
import Rate from "pages/Pages/Rate/Rate";

export const routes = (
  <Routes>
    <Route path="/rate" element={<Rate />} />
    <Route path="/order" element={<Order />} />
    <Route path="/item" element={<Item />} />
    <Route path="/party" element={<Party />} />
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
