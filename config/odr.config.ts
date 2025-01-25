import path from "node:path";
import { defineConfig } from "vite";
import { OutputOptions } from "rollup";

import { version } from "../package.json";
import { compilerOptions } from "./tsconfig.json";
import classGenerator from "./plugins/classGenerator";
import solidSVG from "./plugins/solidSVG";

import { viteSingleFile } from "vite-plugin-singlefile";

import tsconfigPaths from "vite-tsconfig-paths";
import solidPlugin from "vite-plugin-solid";
import zipPack from "vite-plugin-zip-pack";

const generator = classGenerator();

const output: OutputOptions | OutputOptions[] = {
    chunkFileNames: "js/[hash].js",
    entryFileNames: "js/main[hash].js",
    assetFileNames: ({ name }) => {
        const [[, ext]] = Array
            .from((name || "")
                .matchAll(/.([0-9-a-z]+)$/g));
        return `${ext}/[hash].${ext}`;
    }
}

export default defineConfig({
    base: `/${version}/`,
    worker: {
        rollupOptions: {
            output: output,
        }
    },
    esbuild: {
        pure: ['console.log']
    },
    build: {
        target: "esnext",
        outDir: path.join(compilerOptions.outDir, "odr", version),
        minify: "terser",
        terserOptions: {
            toplevel: true,
            compress: {
                dead_code: true,
            },
            format: {
                comments: false,
            }
        },
        rollupOptions: {
            output: output
        }
    },
    css: {
        modules: {
            generateScopedName: (name) => {
                if (name.startsWith("_")) { return name; };
                return generator();
            }
        }
    },
    plugins: [
        solidSVG({
            svgo: {
                enabled: false
            }
        }),
        tsconfigPaths(),
        solidPlugin(),
        viteSingleFile(),
        zipPack({
            inDir: path.join(compilerOptions.outDir, "odr", version),
            outDir: "./zip",
            outFileName: version + "_" + (new Date().getTime()) + ".zip",
        })
    ]
});
