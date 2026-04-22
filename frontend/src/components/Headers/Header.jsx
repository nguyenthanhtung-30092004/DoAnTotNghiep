import { Footprints, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "../ui/Button";
import NavItem from "../ui/NavItem";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/feature/authSlice";
import { Avatar, Dropdown, Space } from "antd";
import {
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
const navLinks = [
  { label: "Home", to: "/" },
  {
    label: "Products",
    to: "/shop",
    children: [
      {
        label: "Giày Trail",
        to: "/shop/giay-trail",
        children: [
          { label: "Giày trail nam", to: "/shop/giay-trail-nam" },
          { label: "Giày trail nữ", to: "/shop/giay-trail-nu" },
        ],
      },
      {
        label: "Giày Road",
        to: "/shop/giay-road",
        children: [
          { label: "Giày road nam", to: "/shop/giay-road-nam" },
          { label: "Giày road nữ", to: "/shop/giay-road-nu" },
        ],
      },
      {
        label: "Áo",
        to: "/shop/ao",
        children: [
          { label: "Áo nam", to: "/shop/ao-nam" },
          { label: "Áo nữ", to: "/shop/ao-nu" },
        ],
      },
      {
        label: "Quần",
        to: "/shop/quan",
        children: [
          { label: "Quần nam", to: "/shop/quan-nam" },
          { label: "Quần nữ", to: "/shop/quan-nu" },
        ],
      },
      {
        label: "Phụ kiện",
        to: "/shop/phu-kien",
        children: [
          { label: "Mũ", to: "/shop/mu" },
          { label: "băng đô", to: "/shop/bang-do" },
          { label: "Kính", to: "/shop/kinh" },
          { label: "Đèn tral", to: "/shop/den-trail" },
          { label: "Khăn ống", to: "/shop/khan-ong" },
          { label: "Calf tay", to: "/shop/calf-tay" },
          { label: "Calg chân", to: "/shop/calg-chan" },
          { label: "Gậy trail", to: "/shop/gay-trail" },
          { label: "Vest trail", to: "/shop/vest-trail" },
          { label: "Tất", to: "/shop/tat" },
          { label: "Bình mềm", to: "/shop/binh-mem" },
          { label: "Starbalm", to: "/shop/starbalm" },
        ],
      },
      {
        label: "Thiết bị",
        to: "/shop/thiet-bi",
        children: [
          { label: "Đồng hồ", to: "/shop/dongho" },
          { label: "Phụ kiện đồng hồ", to: "/shop/phu-kien-dong-ho" },
          { label: "Tai nghe", to: "/shop/tai-nghe" },
          { label: "Máy massage", to: "/shop/may-massage" },
        ],
      },
      {
        label: "Dinh dưỡng",
        to: "/shop/dinh-duong",
        children: [
          { label: "Gel", to: "/shop/gel" },
          { label: "Năng lượng phục hồi", to: "/shop/nang-luong-phuc-hoi" },
          { label: "Muối - sủi điện giải", to: "/shop/muoi-sui-dien-giai" },
          {
            label: "Thanh bar - Bánh năng lượng",
            to: "/shop/thanh-bar-banh-nang-luong",
          },
        ],
      },
    ],
  },
  { label: "About", to: "#" },
  { label: "Contact", to: "#" },
];
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const userMenuItems = [
    {
      key: "1",
      label: <Link to="/account">Hồ sơ cá nhân</Link>,
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      danger: true,
      onClick: () => dispatch(logoutUser()),
    },
  ];
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl py-7">
      <div className="container flex items-center justify-between">
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
            <Search className="h-6 w-4 text-muted-foreground" />
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

          <div className="relative">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
                <Space style={{ cursor: "pointer" }}>
                  <Avatar
                    style={{ backgroundColor: "#1890ff" }}
                    icon={<UserOutlined />}
                  />
                  <span className="hidden lg:inline">{user.fullName}</span>
                  <DownOutlined style={{ fontSize: "10px" }} />
                </Space>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button type="primary">Đăng nhập</Button>
              </Link>
            )}
          </div>

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
        <nav className="md:hidden border-t px-4 py-3 h-[calc(100vh-64px)] overflow-y-auto pb-20 bg-white">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="py-2 border-b border-gray-50 last:border-0"
            >
              <Link
                to={link.to}
                className="block text-[15px] font-bold text-gray-900"
                onClick={() => setMobileOpen(false)} // ĐÓNG MENU KHI CLICK
              >
                {link.label}
              </Link>

              {/* Nếu có menu con Products xổ xuống thì render nó ra */}
              {link.children && (
                <div className="pl-4 mt-2 space-y-3 border-l-2 border-[#22C55E]/20">
                  {link.children.map((child) => (
                    <div key={child.label}>
                      <Link
                        to={child.to}
                        className="block text-[14px] text-[#22C55E] font-semibold mb-1.5"
                        onClick={() => setMobileOpen(false)} // ĐÓNG MENU KHI CLICK
                      >
                        {child.label}
                      </Link>

                      {/* Cấp 3: Giày trail nam, nữ... */}
                      {child.children && (
                        <div className="pl-3 space-y-2">
                          {child.children.map((subChild) => (
                            <Link
                              key={subChild.label}
                              to={subChild.to}
                              className="block text-[13px] text-gray-600 hover:text-[#22C55E]"
                              onClick={() => setMobileOpen(false)} // ĐÓNG MENU KHI CLICK
                            >
                              - {subChild.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
