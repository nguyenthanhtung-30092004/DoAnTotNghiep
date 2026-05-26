import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import Header from "./Header";
import Footer from "./Footer";
import MiniCartDrawer from "../cart/MiniCartDrawer";
import socket from "../../socket/socket";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id && !user?.id) return;

    const userId = user._id || user.id;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-user-room", userId);

    const handleReviewSubmitted = (data) => {
      toast.info(data.message || "Bạn đã gửi đánh giá, vui lòng chờ duyệt");
    };

    const handleReviewStatus = (data) => {
      if (data.status === "APPROVED") {
        toast.success(data.message || "Đánh giá của bạn đã được duyệt");
      } else {
        toast.warning(data.message || "Đánh giá của bạn đã bị từ chối");
      }
    };

    const handleReviewDeleted = (data) => {
      toast.warning(data.message || "Đánh giá của bạn đã bị admin xóa");
    };

    socket.on("review:submitted", handleReviewSubmitted);
    socket.on("review:status", handleReviewStatus);
    socket.on("review:deleted", handleReviewDeleted);

    return () => {
      socket.off("review:submitted", handleReviewSubmitted);
      socket.off("review:status", handleReviewStatus);
      socket.off("review:deleted", handleReviewDeleted);
    };
  }, [user?._id, user?.id]);

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
      <MiniCartDrawer />
    </>
  );
};

export default Layout;