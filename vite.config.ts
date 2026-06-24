import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages serves the project under /Certification-Roadmap/. The path is
// case-sensitive, so the base must match the repository name exactly for asset
// URLs to resolve correctly in production.
export default defineConfig({
  base: '/Certification-Roadmap/',
  plugins: [react()],
});
