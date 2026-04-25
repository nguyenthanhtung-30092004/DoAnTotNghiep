import React from "react";
import Header from "../components/Headers/Header";
import {
  Calendar,
  LogOut,
  Mail,
  MapPin,
  Package,
  Pen,
  Phone,
  User,
} from "lucide-react";
import Profile from "../components/Account/Profile";

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
            {/* <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">
                  Profile Information
                </h2>
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-200 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 rounded-xl">
                  <Pen className="size-4" />
                  Edit Profile
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <User className="size-10 text-primary" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-foreground">
                      Nguyen Thanh Tung
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Member since January 2025
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                      <span className="size-1.5 rounded-full bg-primary"></span>
                      Active
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2  md:col-span-2">
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
                      <User className="size-3" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
                      value="Nguyen Thanh Tung"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
                      <Mail className="size-3" />
                      Email
                    </label>
                    <input
                      type="text"
                      className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
                      value="nguyenthanhtung@gmail.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
                      <Phone className="size-3" />
                      Phone
                    </label>
                    <input
                      type="text"
                      className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
                      value="0123456789"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-muted-foreground text-xs flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      className="fkex h-10 w-full border-input px-3 py-2 text-base ring-offset-background file:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-md bg-muted/50 border-0"
                      value="30/09/2004"
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <Profile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
