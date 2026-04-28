import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NextEra brand — exact from Figma tokens
        nee: {
          navy:     "#0c2737",
          blue:     "#008ac0",
          blueLink: "#0077ac",
          green:    "#48801c",
          greenDark:"#2a421b",
        },
        // Surface backgrounds — exact from Figma
        surface: {
          primary:  "#f8f9fb",   // outer shell bg
          secondary:"#ffffff",
          focus:    "#e1f5ff",   // --background/bg-neutral
          alert:    "#ffefce",   // --background/bg-alert
          success:  "#e4fad9",   // --background/bg-success
          error:    "#ffebe4",   // --background/bg-error
        },
        // Text — exact from Figma
        ink: {
          primary:   "#0c2737",  // --text/primary-text
          secondary: "#72797e",  // --text/secondary-text (Figma exact)
          highlight: "#0077ac",  // --text/title-text
          success:   "#48801c",
          error:     "#d04100",
          alert:     "#503513",
          onDark:    "#ffffff",
        },
        // Borders — exact from Figma
        edge: {
          DEFAULT: "#b5bdc3",
          focus:   "#5ab2e2",
          light:   "#eef1f3",   // --colors/gray/gray-3 (Figma exact)
          medium:  "#d5dade",
        },
        // Priority levels
        priority: {
          crisis:            "#d04100",   // error-text
          crisisBg:          "#ffebe4",   // bg-error
          crisisBorder:      "#ec9070",   // border-error
          strategic:         "#503513",   // alert-text
          strategicBg:       "#ffefce",   // bg-alert
          strategicBorder:   "#f39900",   // border-alert
          operational:       "#72797e",   // secondary-text
          operationalBg:     "#f8f9fb",   // bg-primary
          operationalBorder: "#b5bdc3",   // border primary
          quickwin:          "#48801c",   // success-text
          quickwinBg:        "#e4fad9",   // bg-success
          quickwinBorder:    "#76bb47",   // border-success
        },
        // Brand chips
        brand: {
          mc:        "#6f328f",   // chart-06 purple
          mcBg:      "#f8f9fb",   // bg-primary
          mcBorder:  "#ca8eef",   // chart-03 light purple
          fpl:       "#008ac0",   // bg-highlight / chart-01
          fplBg:     "#e1f5ff",   // bg-neutral
          fplBorder: "#5ab2e2",   // border-focus
          nee:       "#48801c",   // success-text
          neeBg:     "#e4fad9",   // bg-success
          neeBorder: "#76bb47",   // border-success
          neer:      "#0077ac",   // focus-text
          neerBg:    "#e1f5ff",   // bg-neutral
          neerBorder:"#8ac8ed",   // chart-07 (lighter blue to distinguish from FPL)
        },
      },
      fontFamily: {
        sans: ["Arial Nova", "Arial", "sans-serif"],
      },
      // Exact type scale from Figma
      fontSize: {
        "2xs": ["11px", { lineHeight: "14px" }],
        xs:    ["12px", { lineHeight: "14px" }],   // subtitle
        sm:    ["14px", { lineHeight: "18px" }],   // small
        base:  ["16px", { lineHeight: "20px" }],   // p
        lg:    ["18px", { lineHeight: "24px" }],   // large
        xl:    ["20px", { lineHeight: "24px" }],   // h4
        "2xl": ["24px", { lineHeight: "28px" }],   // h3
        "3xl": ["30px", { lineHeight: "32px", letterSpacing: "-0.225px" }], // h2
        "4xl": ["48px", { lineHeight: "48px", letterSpacing: "-1.2px" }],  // h1
      },
      borderRadius: {
        sm:    "4px",
        DEFAULT:"6px",
        md:    "6px",
        lg:    "8px",
        xl:    "10px",   // Figma icon containers use 10px
        "2xl": "14px",   // Figma card radius is 14px
        "3xl": "16px",
      },
      boxShadow: {
        card:  "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)",
        panel: "0px 0px 4px 0px rgba(0,0,0,0.04), 8px 8px 16px 0px rgba(0,0,0,0.08)",
      },
      letterSpacing: {
        tight: "-0.225px",
        tighter:"-0.5px",
      },
    },
  },
  plugins: [],
};
export default config;
