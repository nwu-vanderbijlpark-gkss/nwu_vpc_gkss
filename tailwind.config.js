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
					primary: "#D32F2F", 
					secondary: "#FFFFFF", 
					accent: "#2D2D2D",  
					neutral: "#1A1A1A",
					"base-100": "#1b1b1b",
					info: "#B0BEC5",
					success: "#4CAF50", 
					warning: "#FFC107",
					error: "#FF5722",
				  }				  
			},
		],
	},
};
