import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

// Client Pages
import Home from "./Page/Client/Home/Home";
import Shop from "./Page/Client/Shop/Shop";
import FavoritesPage from "./Components/FavoritesPage";
import Auth from "./Components/Auth";
import PRODUCT_DATA from "./Data/Cards";
import About from "./Page/Client/About/About";
{
  /* Admin Routs */
}
import Contact from "./Page/Client/Contect/Contect";
import Products from "./Page/Admin/Products";
import UsersList from "./Page/Admin/Users";
import OrdersList from "./Components/Orders";
import ProtectedRoute from "./Routes/ProtectedRputes";
import NotFound from "./Routes/NotFound";
import ManageProduct from "./Page/Admin/ManageProduct";
import ShowAllProduct from "./Page/Admin/Product/ShowAllProduct";
import UpdateProduct from "./Page/Admin/Product/UpdateProduct";
import Address from "./Page/Client/Address/Address";
import OederDetails from "./Page/Client/OrderDetails/OederDetails";
import Order from "./Page/Admin/AdminOrder/Order";
import ComplatesOrder from "./Page/Client/OrderDetails/ComplatesOrder";
import ComplateOrder from "./Page/Admin/ComplateOrder/ComplateOrder";
import CancleOrder from "./Page/Admin/CancleOrder/CancleOrder";

const App = () => {
  const [favorites, setFavorites] = useState([]);
  const [products, setProducts] = useState(PRODUCT_DATA);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-left" autoClose={1000} hideProgressBar="true" />

      <Navbar favorites={favorites} />

      {/* Guest Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        {/* User Routes */}
        <Route
          path="/shop"
          element={
            <Shop
              products={products}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          }
        />
        <Route
          path="/favorites"
          element={<FavoritesPage products={products} favorites={favorites} />}
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="/address" element={<Address />} />
        <Route path="/myorders" element={<OrdersList />} />
        <Route path="/orderdetails/:id" element={<OederDetails/>}/>
        <Route path="/complatedorder" element={<ComplatesOrder/>}/>

        {/* Auth Routes */}
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth />} />

        {/* NOt Found Routes */}
        <Route path="*" element={<NotFound />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="products" element={<Products />} />
          <Route path="/manageprodcut" element={<ManageProduct />} />
          <Route path="users" element={<UsersList />} />
          <Route path="/showallproduct" element={<ShowAllProduct />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/adminorder" element={<Order/>}/>
          <Route path="/admincomplateorder" element={<ComplateOrder/>}/>
          <Route path="/admincancleorder" element={<CancleOrder/>}/>
        </Route>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
