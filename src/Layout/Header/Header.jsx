import React, { useState, useEffect } from "react";
import Container from "Components/Container/Container";
import { List, ShoppingCart, X } from "@phosphor-icons/react";
import logo from "assests/Images/safran-logo.jpg";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Navigation from "./Components/Navigation";
import AuthButton from "./Components/AuthButton";
import { useAuth } from "context/AuthContext";
import { useCart } from "context/CartContext";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page is home
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // Set initial header visibility based on current page
  useEffect(() => {
    // Always visible on non-home pages
    if (!isHomePage) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  }, [location.pathname, isHomePage]);

  // Check the scroll position and direction - behavior differs on home vs other pages
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      // For all pages - update scrolled state for styling
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Home page specific behavior
      if (isHomePage) {
        // Determine if scrolling down
        const scrollingDown = window.scrollY > lastScrollY;
        lastScrollY = window.scrollY;

        // Show header when scrolling down and past the threshold
        if (window.scrollY > 100 && scrollingDown) {
          setIsHeaderVisible(true);
        }
        // Hide header when at the top
        else if (window.scrollY <= 0) {
          setIsHeaderVisible(false);
        }
      }
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isDrawerOpen]);

  // Handle cart icon click
  const handleCartClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!user?.verified) {
      navigate("/verify-email", { state: { email: user?.email } });
      return;
    }

    navigate("/cart");
    setIsDrawerOpen(false);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-500 ease-in-out ${
        isHeaderVisible
          ? isHomePage
            ? "lg:opacity-80 translate-y-0"
            : "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-full"
      } ${isScrolled ? "shadow bg-white py-4" : "pt-8 pb-4"}`}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link to="/">
            <img
              className="w-[10rem] md:w-[16rem]"
              src={logo}
              alt="Safran du Liban"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-20">
            <Navigation />

            <div className="flex items-center">
              {/* Cart Icon */}
              <button
                onClick={handleCartClick}
                className="relative p-2 text-secondary hover:text-primary transition-colors"
              >
                <ShoppingCart size={24} />
                {isLoggedIn && user?.verified && getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </button>

              <AuthButton />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-full text-secondary hover:text-primary hover:bg-gray-100 transition-all"
            onClick={toggleDrawer}
            aria-label="Menu"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-menu"
          >
            <List size={28} weight="bold" />
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[10000000] h-screen w-[85%] max-w-[320px] bg-white shadow-xl transform transition-all duration-300 ease-in-out opacity-100 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isDrawerOpen}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="px-5 py-5 flex items-center justify-between border-b border-gray-100">
            <Link to="/" onClick={() => setIsDrawerOpen(false)}>
              <img
                className="w-[10rem]"
                src={logo}
                alt="Safran du Liban"
                id="drawer-title"
              />
            </Link>
            <button
              className="p-2 rounded-full text-secondary hover:text-primary hover:bg-gray-100 transition-all"
              onClick={toggleDrawer}
              aria-label="Close menu"
            >
              <X size={24} weight="bold" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-grow overflow-y-auto p-6 bg-white opacity-100">
            {/* Mobile Navigation */}
            <div className="mb-8">
              <div>
                {/* Overriding the default navigation to make it work in drawer */}
                <Navigation
                  isMobile={true}
                  onNavClick={() => setIsDrawerOpen(false)}
                />
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="border-t border-gray-100 p-6 flex items-center justify-between bg-white shadow-inner">
            {/* Cart Icon */}
            <button
              onClick={handleCartClick}
              className="relative p-2 rounded-full hover:bg-gray-100 text-secondary hover:text-primary transition-all"
            >
              <ShoppingCart size={24} />
              {isLoggedIn && user?.verified && getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* Auth Button in Drawer */}
            <div onClick={() => setIsDrawerOpen(false)}>
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop for mobile drawer */}
      {/* <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isDrawerOpen ? "opacity-50 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleDrawer}
        aria-hidden="true"
      ></div> */}
    </header>
  );
};

export default Header;
