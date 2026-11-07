import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mizumawari-kripton.com',
  server: {
    port: 4321,
    host: true
  }
});