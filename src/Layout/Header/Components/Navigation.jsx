import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const Navigation = ({ isMobile, onNavClick }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavClick = () => {
    if (isMobile && onNavClick) {
      onNavClick();
    }
  };

  return (
    <ul
      className={`${
        isMobile
          ? "flex flex-col divide-y divide-gray-100"
          : "flex items-center gap-8 lg:gap-12 xl:gap-24"
      } text-lg font-semibold`}
      id="mobile-menu"
    >
      <li className={isMobile ? "py-3" : ""}>
        <NavLink
          to="our-products"
          className={({ isActive }) =>
            isActive
              ? isMobile
                ? "text-primary block py-2 border-l-4 border-primary px-4"
                : "text-primary"
              : isMobile
              ? "text-black hover:text-primary transition-all block py-2 px-5 hover:border-l-4 hover:border-primary"
              : "text-black hover:text-primary transition-colors"
          }
          onClick={handleNavClick}
        >
          Our Products
        </NavLink>
      </li>
      <li className={isMobile ? "py-3" : ""}>
        <NavLink
          to="career"
          className={({ isActive }) =>
            isActive
              ? isMobile
                ? "text-primary block py-2 border-l-4 border-primary px-4"
                : "text-primary"
              : isMobile
              ? "text-black hover:text-primary transition-all block py-2 px-5 hover:border-l-4 hover:border-primary"
              : "text-black hover:text-primary transition-colors"
          }
          onClick={handleNavClick}
        >
          Career
        </NavLink>
      </li>
      <li className={isMobile ? "py-3" : ""}>
        <NavLink
          to="inspiration"
          className={({ isActive }) =>
            isActive
              ? isMobile
                ? "text-primary block py-2 border-l-4 border-primary px-4"
                : "text-primary"
              : isMobile
              ? "text-black hover:text-primary transition-all block py-2 px-5 hover:border-l-4 hover:border-primary"
              : "text-black hover:text-primary transition-colors"
          }
          onClick={handleNavClick}
        >
          Inspiration
        </NavLink>
      </li>
    </ul>
  );
};

// Set default props
Navigation.defaultProps = {
  isMobile: false,
  onNavClick: () => {},
};

export default Navigation;
