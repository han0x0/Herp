import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// Bind to all interfaces so the dev server is reachable from other devices
		// on the LAN (phones, tablets, other laptops). Set HOST=127.0.0.1 to restrict
		// back to loopback for paranoid local-only work.
		host: process.env.HOST ?? '0.0.0.0',
		port: 5173,
		strictPort: true
	},
	test: {
		include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
		environment: 'node',
		setupFiles: ['./src/vitest.setup.ts']
	}
});
