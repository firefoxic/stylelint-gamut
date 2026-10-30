import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		include: [`src/**/*.test.js`],
		isolate: false,
		watch: false,
		reporters: process.env.CI ? [`github-actions`, `default`] : [`dot`],
	},
})
