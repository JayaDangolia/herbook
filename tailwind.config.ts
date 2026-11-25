import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          rose: "#E98CA8",
          "rose-light": "#F7CAD8",
          "rose-dark": "#D26E8C",
          lavender: "#B69ADD",
          "lavender-light": "#DECFF7",
          "lavender-dark": "#9270BF",
          plum: "#60436E",
          "plum-dark": "#442E4F",
          "plum-light": "#7D5C8E",
          blush: "#FFF1F5",
          "blush-subtle": "#FFF8FA",
          surface: "#FFFAFC",
          text: "#29212D",
          "text-muted": "#6E6274",
          success: "#27866C",
          warning: "#D99232",
          error: "#C94A58",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(96, 67, 110, 0.08)",
        card: "0 2px 12px -1px rgba(96, 67, 110, 0.06)",
        glow: "0 0 25px rgba(233, 140, 168, 0.3)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
