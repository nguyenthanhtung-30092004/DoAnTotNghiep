const nodemailer = require("nodemailer");
require("dotenv").config();

const SendMailForgotPassword = async (email, otp) => {
  try {
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transport.sendMail({
      from: `"Runner-Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      text: `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html lang="vi">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f4f6fb;
              font-family: 'Segoe UI', Tahoma, sans-serif;
            }

            .wrapper {
              max-width: 600px;
              margin: 40px auto;
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            }

            .header {
              background: linear-gradient(135deg, #111827, #374151);
              padding: 30px;
              text-align: center;
              color: white;
            }

            .header h1 {
              margin: 0;
              font-size: 22px;
            }

            .content {
              padding: 30px;
              color: #2d3436;
            }

            .content p {
              font-size: 15px;
              line-height: 1.6;
              margin-bottom: 15px;
            }

            .otp-container {
              margin: 25px 0;
              text-align: center;
            }

            .otp {
              display: inline-block;
              padding: 18px 28px;
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 6px;
              color: #111827;
              background: #f3f4f6;
              border-radius: 12px;
              border: 2px dashed #9ca3af;
            }

            .footer {
              text-align: center;
              font-size: 13px;
              color: #636e72;
              padding: 20px;
              background: #fafbff;
            }
          </style>
        </head>

        <body>
          <div class="wrapper">
            <div class="header">
              <h1>🔐 Đặt lại mật khẩu</h1>
            </div>

            <div class="content">
              <p>Xin chào,</p>

              <p>
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                Hãy sử dụng mã OTP bên dưới để tiếp tục:
              </p>

              <div class="otp-container">
                <div class="otp">${otp}</div>
              </div>

              <p>
                Mã này sẽ hết hạn sau vài phút vì lý do bảo mật.
              </p>

              <p>
                Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này.
              </p>
            </div>

            <div class="footer">
              © 2026 Runner-Shop. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Forgot password email sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("Error sending forgot password email:", error);
    throw error;
  }
};

module.exports = SendMailForgotPassword;
