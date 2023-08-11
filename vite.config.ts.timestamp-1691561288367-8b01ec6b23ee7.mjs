// vite.config.ts
import { defineConfig } from "file:///D:/Projects/gorenty/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Projects/gorenty/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  server: {
    // https: true,
    host: true
  },
  // plugins: [react(), basicSsl()],
  plugins: [react()],
  resolve: {
    alias: {
      hooks: "/src/hooks",
      pages: "/src/pages",
      utils: "/src/utils",
      types: "/src/types",
      store: "/src/store",
      assets: "/src/assets",
      services: "/src/services",
      components: "/src/components"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxnb3JlbnR5XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxQcm9qZWN0c1xcXFxnb3JlbnR5XFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9Qcm9qZWN0cy9nb3JlbnR5L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgLy8gaHR0cHM6IHRydWUsXHJcbiAgICAgICAgaG9zdDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICAvLyBwbHVnaW5zOiBbcmVhY3QoKSwgYmFzaWNTc2woKV0sXHJcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgaG9va3M6ICcvc3JjL2hvb2tzJyxcclxuICAgICAgICAgICAgcGFnZXM6ICcvc3JjL3BhZ2VzJyxcclxuICAgICAgICAgICAgdXRpbHM6ICcvc3JjL3V0aWxzJyxcclxuICAgICAgICAgICAgdHlwZXM6ICcvc3JjL3R5cGVzJyxcclxuICAgICAgICAgICAgc3RvcmU6ICcvc3JjL3N0b3JlJyxcclxuICAgICAgICAgICAgYXNzZXRzOiAnL3NyYy9hc3NldHMnLFxyXG4gICAgICAgICAgICBzZXJ2aWNlczogJy9zcmMvc2VydmljZXMnLFxyXG4gICAgICAgICAgICBjb21wb25lbnRzOiAnL3NyYy9jb21wb25lbnRzJyxcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBaVAsU0FBUyxvQkFBb0I7QUFDOVEsT0FBTyxXQUFXO0FBR2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFFBQVE7QUFBQTtBQUFBLElBRUosTUFBTTtBQUFBLEVBQ1Y7QUFBQTtBQUFBLEVBRUEsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLE9BQU87QUFBQSxNQUNQLFFBQVE7QUFBQSxNQUNSLFVBQVU7QUFBQSxNQUNWLFlBQVk7QUFBQSxJQUNoQjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
