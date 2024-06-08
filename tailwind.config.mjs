/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		fontFamily: {
			sans: ["Outfit", "Inter", "sans-serif"],
			cursive: ["Pacifico", "cursive"],
		},
		extend: {
			screens: {
				xl: "1320px",
			},
		},
	},
	plugins: [require("@tailwindcss/typography")],
};
