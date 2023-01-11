import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    build: {
      rollupOptions: {
        output: {
          dir: "./static",
        },
      },
    },
    plugins: [react()],
  });
};
