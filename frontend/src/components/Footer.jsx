import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Electronify</h2>
          <p className="text-sm leading-6">
            Your one-stop shop for the latest electronics, gadgets, and
            accessories. We offer fast delivery, easy returns, and quality
            support.
          </p>
        </div>

        {/* Customer Support */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Customer Support</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="/order" className="hover:underline">
                Track Order
              </a>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Cart
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                My Account
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-sm">Email: support@electronify.com</p>
          <p className="text-sm">Phone: +91 98765 4XXXX</p>
          <div className="flex space-x-4 mt-4 text-xl">
            <a
              href="https://www.facebook.com/your_page"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com/your_handle"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400"
            >
              <FaTwitter />
            </a>
            <a
              href="https://www.instagram.com/ravijethva._"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/ravi-jethva-1503a9279"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t hidden md:block border-gray-700 mt-10 text-center text-sm py-4">
        &copy; {new Date().getFullYear()} Electronify. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
