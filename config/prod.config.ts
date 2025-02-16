import path from "node:path"

import { defineConfig } from "vite"
import { OutputOptions } from "rollup"

import { compilerOptions } from "./tsconfig.json"
import classGenerator from "./plugins/classGenerator"
import solidSVG from "./plugins/solidSVG"
import eruda from "./plugins/eruda"

import tsconfigPaths from "vite-tsconfig-paths"
import solidPlugin from "vite-plugin-solid"
import injectEntryChunk from "./plugins/injectEntryChunk"

import { execSync } from "child_process" // Import execSync

const gitCommitHash = execSync("git rev-parse --short HEAD").toString().trim()

const generator = classGenerator()

const output: OutputOptions | OutputOptions[] = {
  chunkFileNames: "js/[hash].js",
  entryFileNames: "js/[hash].js",
  assetFileNames: ({ name }) => {
    const [[, ext]] = Array.from((name || "").matchAll(/.([0-9-a-z]+)$/g))
    return `${ext}/[hash].${ext}`
  },
  experimentalMinChunkSize: 15_000,
}

export default defineConfig({
  base: "/frontend",
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(gitCommitHash),
  },
  worker: {
    rollupOptions: {
      output: output,
    },
  },
  publicDir: "public",
  // esbuild: {
  //   pure: ["console.log"],
  // },
  build: {
    target: "esnext",
    outDir: path.join(compilerOptions.outDir),
    minify: "terser",
    terserOptions: {
      toplevel: true,
      compress: {
        dead_code: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: output,
    },
  },
  css: {
    modules: {
      generateScopedName: (name) => {
        if (name.startsWith("_")) {
          return name
        }
        return generator()
      },
    },
  },
  plugins: [
    // eruda(),
    tsconfigPaths(),
    solidPlugin(),
    injectEntryChunk(),
    solidSVG({
      svgo: {
        enabled: false,
      },
    }),
  ],
})
