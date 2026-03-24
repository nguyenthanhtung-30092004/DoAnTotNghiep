import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/Button";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "#" },
  { label: "About", to: "#" },
  { label: "Contact", to: "#" },
];
const Header = () => {
  //   const { totalItems } = useCard();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl tracking-tight"
        >
          <Footprints className="h-6 w-6 text-primary" />
          <span>RunVault</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="relative px-3 py-2 text-sm font-medium text-muted-foreground rounded-lg transition-colors hover:text-foreground hover:bg-accent after:absolute after:w-full after:scale-x-0 after:duration-300 hover:after:scale-100 after:transition-all after:h-[1.5px] after:bg-primary after:left-0 after:-bottom-[2px]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 bg-muted rounded-lg px-3 py-2 group border border-transparent focus-within:border-green-300">
            <Search className="h-4 w-4 text-muted-foreground " />
            <input
              type="text"
              placeholder="Search gear..."
              className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground"
            />
          </div>

          {/* Shopping cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {/* {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )} */}
            </Button>
          </Link>
          {/* User */}
          <Link to="/account">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 animate-fade-up">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
