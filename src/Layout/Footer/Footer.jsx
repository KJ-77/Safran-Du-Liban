import Container from "Components/Container/Container";
import React from "react";
import logo from "../../assets/Images/logo_white.png";
import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="border-t pt-24 bg-secondary">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-y-16 gap-x-16">
          <div className="lg:col-span-3">
            <img className="w-[12rem] md:w-[16rem]" src={logo} alt="" />
          </div>

          <ul className="flex flex-col gap-y-3 text-xl text-white">
            <li>
              <Link
                className="hover:underline text-white hover:text-white/80"
                to="/"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline text-white hover:text-white/80"
                to="/our-products"
              >
                Our Products
              </Link>
            </li>

            <li>
              <Link
                className="hover:underline text-white hover:text-white/80"
                to="/career"
              >
                Career
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline text-white hover:text-white/80"
                to="/login"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                className="hover:underline text-white hover:text-white/80"
                to="/register"
              >
                Register
              </Link>
            </li>
          </ul>

          <div className="text-white">
            <p className="text-2xl font-bold mb-4">Contact us</p>
            <ul className="flex flex-col">
              <li className="">
                <a className="hover:underline" href="tel:+9613473410">
                  Beirut +961 (3) 473 410
                </a>
              </li>
              <li className="">
                <a className="hover:underline" href="tel:+41786421389">
                  Geneva +41 78 642 13 89
                </a>
              </li>
              <li className="">
                <a
                  className="hover:underline"
                  href="mailto:safranduliban@gmail.com"
                >
                  safranduliban@gmail.com
                </a>
              </li>

              <li className="flex gap-x-4 mt-6">
                <a
                  className="hover:scale-[0.9] hover:text-white/80 transition ease-in duration-300"
                  href="https://www.facebook.com/safranduliban/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookLogo size={36} />
                </a>
                <a
                  className="hover:scale-[0.9] hover:text-white/80 transition ease-in duration-300"
                  href="https://www.instagram.com/safranduliban?igsh=Mmxjbm94ZzZ1dnN5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramLogo size={36} />
                </a>
                <a
                  className="hover:scale-[0.9] hover:text-white/80 transition ease-in duration-300"
                  href="https://www.linkedin.com/company/safran-du-liban/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinLogo size={36} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex border-t border-white/20 justify-center items-center py-6 mt-20">
          <p className="text-white text-sm">
            Copyright © 2025 Safran du Liban. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
