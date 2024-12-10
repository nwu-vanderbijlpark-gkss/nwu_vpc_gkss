import typography from '@tailwindcss/typography';
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {},
	},

	plugins: [typography, daisyui],

	daisyui: {
		themes: [
			{
				geekulcha: {
					primary: "#FF0000", // Red
					secondary: "#FFFFFF", // White
					accent: "#2D2D2D", // Black accent
					neutral: "#1A1A1A", // Dark neutral
					"base-100": "#1b1b1b", //Grayish Black
					info: "#B0BEC5", // Light neutral
					success: "#4CAF50", // Green
					warning: "#FFC107", // Yellow
					error: "#FF5722", // Reddish error
				},
			},
		],
	},
};
