const setCookie = (res, name, value, ms) => {
  res.cookie(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: ms, // Truyền trực tiếp số miliseconds vào đây
  });
};

module.exports = setCookie;
