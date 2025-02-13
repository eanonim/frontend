import { defineConfig, loadEnv } from "vite"

import tsconfigPaths from "vite-tsconfig-paths"
import solidPlugin from "vite-plugin-solid"

import classGenerator from "./plugins/classGenerator"
import eruda from "./plugins/eruda"
import solidSVG from "./plugins/solidSVG"
import dotenv from "dotenv"
dotenv.config()

const generator = classGenerator()

const TELEGRAM_SIGN = process.env.TELEGRAM_SIGN

export default defineConfig({
  base: "./",
  define: {
    "import.meta.env.TELEGRAM_SIGN": JSON.stringify(TELEGRAM_SIGN),
  },
  css: {
    modules: {
      generateScopedName: (name) => {
        if (name.startsWith("_")) {
          return name
        }
        return `${name}_${generator()}`
      },
    },
  },
  server: {
    port: 18300,
    host: "0.0.0.0",
  },
  plugins: [
    eruda(),
    tsconfigPaths(),
    solidPlugin(),
    solidSVG({
      svgo: {
        enabled: false,
      },
    }),
  ],
})
