import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/Button";
import NavItem from "../ui/NavItem";
const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "Products",
    to: "#",
    children: [
      {
        label: "Giày Trail",
        to: "/products/giay-trail",
        children: [
          { label: "Giày trail nam", to: "/products/giay-trail/nam" },
          { label: "Giày trail nữ", to: "/products/giay-trail/nu" },
        ],
      },
      {
        label: "Giày Road",
        to: "/products/giay-road",
      },
    ],
  },
  { label: "About", to: "#" },
  { label: "Contact", to: "#" },
];
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Footprints className="h-6 w-6 text-primary" />
          RunVault
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-40"
            />
          </div>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>

          {/* User */}
          <Link to="/account">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t px-4 py-3">
          {navLinks.map((link) => (
            <Link key={link.label} to={link.to} className="block py-2 text-sm">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
