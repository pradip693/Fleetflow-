import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "next.config.{js,ts,mjs}",
    "src/app/**/{page,layout,loading,error,not-found}.{ts,tsx}",
    "src/app/api/**/route.{ts}",
    "src/pages/**/*.{ts,tsx}",
  ],

  project: ["src/**/*.{ts,tsx}"],

  ignore: [".next/**", "node_modules/**"],

  paths: {
    "@/*": ["src/*"],
  },
};

export default config;
