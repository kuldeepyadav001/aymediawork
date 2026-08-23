import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const withAlpha = (variable: string) => `hsl(var(${variable}) / <alpha-value>)`;

const config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx,mdx}",
    "./emails/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "30rem",
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem",
      "3xl": "120rem",
    },
    extend: {
      animation: {
        float: "float 7s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      backgroundImage: {
        "brand-conic":
          "conic-gradient(from 210deg at 50% 50%, hsl(var(--brand-blue)), hsl(var(--brand-violet)), hsl(var(--brand-red)), hsl(var(--brand-blue)))",
        "brand-linear":
          "linear-gradient(110deg, hsl(var(--brand-blue)), hsl(var(--brand-violet)) 58%, hsl(var(--brand-red)))",
        "brand-radial":
          "radial-gradient(circle at center, hsl(var(--brand-blue) / 0.24), transparent 68%)",
      },
      borderRadius: {
        xl: "var(--radius)",
        lg: "calc(var(--radius) - 0.25rem)",
        md: "calc(var(--radius) - 0.5rem)",
        sm: "calc(var(--radius) - 0.625rem)",
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--brand-blue) / 0.14), 0 20px 80px -24px hsl(var(--brand-blue) / 0.42)",
        "glow-violet":
          "0 0 0 1px hsl(var(--brand-violet) / 0.14), 0 20px 80px -24px hsl(var(--brand-violet) / 0.4)",
        panel:
          "0 1px 0 hsl(0 0% 100% / 0.04) inset, 0 24px 80px hsl(230 45% 2% / 0.5)",
      },
      colors: {
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),
        card: {
          DEFAULT: withAlpha("--card"),
          foreground: withAlpha("--card-foreground"),
        },
        popover: {
          DEFAULT: withAlpha("--popover"),
          foreground: withAlpha("--popover-foreground"),
        },
        primary: {
          DEFAULT: withAlpha("--primary"),
          foreground: withAlpha("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withAlpha("--secondary"),
          foreground: withAlpha("--secondary-foreground"),
        },
        muted: {
          DEFAULT: withAlpha("--muted"),
          foreground: withAlpha("--muted-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          foreground: withAlpha("--accent-foreground"),
        },
        destructive: {
          DEFAULT: withAlpha("--destructive"),
          foreground: withAlpha("--destructive-foreground"),
        },
        border: withAlpha("--border"),
        input: withAlpha("--input"),
        ring: withAlpha("--ring"),
        surface: {
          DEFAULT: withAlpha("--surface"),
          elevated: withAlpha("--surface-elevated"),
        },
        brand: {
          blue: withAlpha("--brand-blue"),
          violet: withAlpha("--brand-violet"),
          red: withAlpha("--brand-red"),
        },
        success: withAlpha("--success"),
        warning: withAlpha("--warning"),
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Arial", "sans-serif"],
        sans: ["var(--font-manrope)", "Arial", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-2xl": [
          "clamp(4rem, 11vw, 10rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.075em",
            lineHeight: "0.82",
          },
        ],
        "display-xl": [
          "clamp(3.5rem, 8vw, 7.5rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.065em",
            lineHeight: "0.88",
          },
        ],
        "display-lg": [
          "clamp(2.75rem, 6vw, 5.75rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.055em",
            lineHeight: "0.92",
          },
        ],
        "heading-xl": [
          "clamp(2.25rem, 4.4vw, 4rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.045em",
            lineHeight: "0.98",
          },
        ],
        "heading-lg": [
          "clamp(1.875rem, 3vw, 3rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.035em",
            lineHeight: "1.02",
          },
        ],
        "heading-md": [
          "clamp(1.5rem, 2vw, 2.125rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.025em",
            lineHeight: "1.1",
          },
        ],
        "heading-sm": [
          "clamp(1.25rem, 1.5vw, 1.5rem)",
          {
            fontWeight: "500",
            letterSpacing: "-0.02em",
            lineHeight: "1.18",
          },
        ],
        lead: [
          "clamp(1.0625rem, 1.4vw, 1.25rem)",
          { letterSpacing: "-0.015em", lineHeight: "1.65" },
        ],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -0.75rem, 0)" },
        },
        marquee: {
          to: { transform: "translate3d(-50%, 0, 0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.96)" },
          "50%": { opacity: "0.7", transform: "scale(1.04)" },
        },
        shimmer: {
          to: { backgroundPosition: "200% center" },
        },
      },
      maxWidth: {
        copy: "44rem",
        shell: "90rem",
        wide: "105rem",
      },
      spacing: {
        gutter: "clamp(1rem, 4vw, 3rem)",
        section: "clamp(5rem, 10vw, 9rem)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      transitionTimingFunction: {
        cinematic: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

export default config;
