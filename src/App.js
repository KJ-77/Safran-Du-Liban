import Header from "Layout/Header/Header";
import Footer from "Layout/Footer/Footer";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "Pages/Home/Home";
import Products from "Pages/Products/Products";
import Carrer from "Pages/Carrer/Carrer";
import Inspiration from "Pages/Inspiration/Inspiration";
import Login from "Pages/Authentication/Login/Login";
import Register from "Pages/Authentication/Register/Regitser";
import EmailVerification from "Pages/Authentication/Verification/EmailVerification";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Profile from "Pages/Profile/Profile";
import Cart from "Pages/Cart/Cart";
import Checkout from "Pages/Checkout/Checkout";
import CheckoutSuccess from "Pages/Checkout/CheckoutSuccess";
import { useEffect } from "react";

// ScrollToTop component that will scroll to top on route changes
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <ScrollToTop />
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path="our-products" element={<Products />} />
            <Route path="career" element={<Carrer />} />
            <Route path="inspiration" element={<Inspiration />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="verify-email" element={<EmailVerification />} />
            <Route path="profile" element={<Profile />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="checkout/success/:orderNumber"
              element={<CheckoutSuccess />}
            />
          </Routes>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
