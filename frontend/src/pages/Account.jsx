import React from "react";
import Header from "../components/Headers/Header";
import {
  Calendar,
  ChevronRight,
  CircleCheck,
  Clock,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pen,
  Phone,
  Truck,
  User,
} from "lucide-react";
import Profile from "../components/Account/Profile";
import Orders from "../components/Account/Orders";

const Account = () => {
  return (
    <div>
      <Header />
      <div className="container py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          My Account
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 shrink-0">
            <div className="rounded-2xl border border-border bg-card p-2 md:sticky md:top-24">
              {/* User */}
              <div className="flex items-center gap-3 p-3 mb-1">
                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    John Doe
                  </p>
                  <p className="text-xs text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </div>

              {/* Gach chan */}
              <div className="h-px bg-border mx-2 mb-1"></div>

              {/* Menu */}
              <nav className="flex flex-grow md:flex-col gap-0.5 overflow-x-auto md:overflow-visible">
                <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full text-muted-foreground bg-primary">
                  <User className="size-4 text-white" />
                  <span className="text-white">Profile</span>
                </button>
                <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <Package className="size-4" />
                  <span>Orders</span>
                </button>
                <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors whitespace-normal w-full text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                  <MapPin className="size-4" />
                  <span>Addresses</span>
                </button>
              </nav>

              {/* Gach chan 2 */}
              <div className="h-px bg-border mx-2 my-1 hidden md:block"></div>
              <button className="hidden md:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full">
                <LogOut className="size-4" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* <Profile /> */}
            <Orders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
