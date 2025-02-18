import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#4E80EE",
          "primary-content": "#FFFFFF",
          secondary: "#FFAF00",
          accent: "#115FE6",
          neutral: "#323640",
          "neutral-content": "#3E4450",
          "base-100": "#FFFFFF",
          "base-200": "#F6F7F9",
          "base-300": "#E5E6E6",
          "base-content": "#646B79",
          success: "#6DCEC3",
          info: "#0C3897",
          "info-content": "#B9CBE5",
          error: "#F87E94",
        },
      },
    ],
  },
};
export default config;
