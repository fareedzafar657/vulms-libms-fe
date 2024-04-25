/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
        colors: {
          background: "rgba(255, 100, 255, .2)",
          backgroundImage: {
            // "hero-pattern": "url('/img/umair.png')",
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic":
              "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            bg2: " url('/img/umair.png')",
            // screens: {
            //      "sm":{"max":'639px'
            //     w-['50px']
            //     },
            // }
          },
        },
      },
      plugins: [],
    },
  },
};
