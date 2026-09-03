import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * A port handed to us, when something else is choosing.
 *
 * Vite does not read PORT on its own. Honouring it lets a preview or a second
 * instance be told which port to take instead of the whole config having to
 * hardcode one, which is what caused two of them to fight over 5199. When the
 * port is assigned we also insist on it: a caller that was promised a port and
 * silently got the next one up is worse off than a caller that was told no.
 *
 * Nothing is passed in the ordinary case, so `npm run dev:client` still serves
 * 5173 and still drifts to the next free port if 5173 is taken.
 */
const assignedPort = Number(process.env.PORT) || null;

export default defineConfig({
  plugins: [react()],
  server: {
    port: assignedPort ?? 5173,
    strictPort: assignedPort !== null,
    // Proxying the API keeps the browser on a single origin, so the session
    // cookie is same-site and needs no CORS exemption during development.
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
