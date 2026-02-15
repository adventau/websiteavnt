import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        body: ["Manrope", "system-ui", "sans-serif"]
      },
      colors: {
        bg: "#070B10",
        panel: "#0F1520",
        ink: "#E7ECF2",
        accent: "#63F5B0",
        muted: "#94A3B8"
      }
    }
  },
  plugins: []
};

export default config;
