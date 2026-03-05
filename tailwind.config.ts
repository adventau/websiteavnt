import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        avnt: {
          purple: "#7C3AED",
          "purple-dark": "#4C1D95",
          "purple-light": "#A78BFA",
          bg: "#0A0514",
          "bg-2": "#0F0920",
          card: "#130D24",
          border: "#2D1B55",
          text: "#E5E0F5",
          muted: "#9B88CC",
        },
      },
      backgroundImage: {
        "avnt-gradient":
          "linear-gradient(135deg, #0A0514 0%, #150B2E 50%, #0A0514 100%)",
        "avnt-hero":
          "radial-gradient(ellipse at 60% 0%, rgba(124,58,237,0.3) 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, rgba(76,29,149,0.2) 0%, transparent 50%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(19,13,36,0.9) 0%, rgba(45,27,85,0.4) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
