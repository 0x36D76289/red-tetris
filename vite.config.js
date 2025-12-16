const { defineConfig } = require("vite");
const react = require("@vitejs/plugin-react");
const path = require("path");

const devPort = Number(process.env.VITE_PORT) || 5173;
const previewPort = Number(process.env.VITE_PREVIEW_PORT) || 4173;

module.exports = defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  server: {
    port: devPort,
    strictPort: true,
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  preview: {
    port: previewPort,
    strictPort: true,
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  esbuild: {
    loader: "jsx",
    include: /client\/.*\.js$/,
    exclude: /node_modules/,
  },
});
