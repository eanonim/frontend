import { defineConfig } from "vite"

import tsconfigPaths from "vite-tsconfig-paths"
import solidPlugin from "vite-plugin-solid"

import classGenerator from "./plugins/classGenerator"
import eruda from "./plugins/eruda"
import solidSVG from "./plugins/solidSVG"

const generator = classGenerator()

export default defineConfig({
  base: "./",
  define: {
    "import.meta.env.TELEGRAM_SIGN": JSON.stringify(
      "user=%7B%22id%22%3A463112366%2C%22first_name%22%3A%22%F0%9D%95%80%F0%9D%95%9A%F0%9D%95%A4%F0%9D%95%A6%F0%9D%95%A4%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22xuserz%22%2C%22language_code%22%3A%22ru%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%7D&chat_instance=-8394018409052904607&chat_type=private&start_param=ref_425140463112366&auth_date=1728936110&hash=435fb2af9172a2c9dac4b9ad54fac83d3c8385c3cef577876214211878b127be",
    ),
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
