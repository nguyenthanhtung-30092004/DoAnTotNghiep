import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const utf8JavaScriptHeaders = () => {
  const middleware = (_req, res, next) => {
    const setHeader = res.setHeader.bind(res);

    res.setHeader = (name, value) => {
      if (
        String(name).toLowerCase() === "content-type" &&
        typeof value === "string" &&
        /(?:text|application)\/javascript/i.test(value) &&
        !/charset=/i.test(value)
      ) {
        return setHeader(name, `${value}; charset=utf-8`);
      }

      return setHeader(name, value);
    };

    next();
  };

  return {
    name: "utf8-javascript-headers",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [utf8JavaScriptHeaders(), react()],
});
