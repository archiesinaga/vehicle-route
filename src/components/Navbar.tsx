
"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar bg-primary text-primary-content px-4 shadow-md">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl" href="/">
          Vehicle Route Tracker
        </a>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-4">
        <a href="/" className="btn btn-ghost">
          Home
        </a>
        <a href="/routes" className="btn btn-ghost">
          Routes
        </a>
        <a href="/about" className="btn btn-ghost">
          About
        </a>
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden">
        <button
          className="btn btn-ghost"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary text-primary-content flex flex-col items-start px-4 py-2 space-y-2 shadow-lg md:hidden z-50">
          <a href="/" className="btn btn-ghost w-full text-left">
            Home
          </a>
          <a href="/routes" className="btn btn-ghost w-full text-left">
            Routes
          </a>
          <a href="/about" className="btn btn-ghost w-full text-left">
            About
          </a>
        </div>
      )}
    </nav>
  );
}
