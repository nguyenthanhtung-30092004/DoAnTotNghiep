const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOrderStatusEmail = async (email, order, status) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let statusText = "Đang xử lý";
    let statusMessage = "Đơn hàng của bạn đang được xử lý.";

    switch (status) {
      case "CONFIRMED":
        statusText = "Đã xác nhận";
        statusMessage =
          "Đơn hàng của bạn đã được xác nhận và đang chuẩn bị giao.";
        break;
      case "SHIPPING":
        statusText = "Đang giao hàng";
        statusMessage = "Đơn hàng của bạn đang trên đường giao đến bạn.";
        break;
      case "DELIVERED":
        statusText = "Đã giao hàng";
        statusMessage =
          "Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!";
        break;
      case "CANCELLED":
        statusText = "Đã hủy";
        statusMessage = "Đơn hàng của bạn đã bị hủy.";
        break;
    }

    const info = await transport.sendMail({
      from: `"Runner Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Cập nhật đơn hàng ${order.orderCode || order._id}`,
      text: `Xin chào, ${statusMessage} Mã đơn hàng của bạn là: ${order.orderCode || order._id}`,
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
        body { margin: 0; padding: 0; background: #f4f6fb; font-family: 'Segoe UI', Tahoma, sans-serif; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0984e3, #74b9ff); padding: 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { padding: 30px; color: #2d3436; }
        .content p { font-size: 15px; line-height: 1.6; margin-bottom: 15px; }
        .footer { text-align: center; font-size: 13px; color: #636e72; padding: 20px; background: #fafbff; }
        .status-box { background: #f1f2ff; padding: 15px; border-radius: 8px; border-left: 4px solid #0984e3; margin: 20px 0; }
        </style>
        </head>
        <body>
        <div class="wrapper">
            <div class="header">
            <h1>📦 Cập nhật đơn hàng</h1>
            </div>
            <div class="content">
            <p>Xin chào,</p>
            <div class="status-box">
                <strong>Trạng thái mới:</strong> ${statusText}<br/>
                <strong>Mã đơn hàng:</strong> ${order._id}<br/>
                <strong>Tổng tiền:</strong> ${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.finalPrice)}
            </div>
            <p>${statusMessage}</p>
            <p>Cảm ơn bạn đã đồng hành cùng Runner-Shop!</p>
            </div>
            <div class="footer">
            © 2026 Runner-Shop. All rights reserved.
            </div>
        </div>
        </body>
        </html>
      `,
    });
    console.log("Order status email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error sending order status email:", error);
    throw error;
  }
};

module.exports = sendOrderStatusEmail;
