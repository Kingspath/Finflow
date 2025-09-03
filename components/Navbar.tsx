"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    { name: "About", href: "/#about" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-finflow-primary">
          FinFlow
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`font-medium ${
                  pathname === item.href
                    ? "text-finflow-primary"
                    : "text-gray-600 hover:text-finflow-primary"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/signin"
            className="text-gray-700 hover:text-finflow-primary"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="bg-finflow-primary text-white px-4 py-2 rounded-md hover:bg-finflow-dark transition"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-6 py-4">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block text-gray-700 hover:text-finflow-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/signin"
                className="block text-gray-700 hover:text-finflow-primary"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/signup"
                className="block bg-finflow-primary text-white px-4 py-2 rounded-md text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
