import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const localFallback = 'file:///D:/Project/porto-rama/node_modules/';
const importDependency = async (name, fallback) => import(name).catch(() => import(new URL(fallback, localFallback).href));
const [{ defineConfig }, vueModule] = await Promise.all([
  importDependency('vite', 'vite/dist/node/index.js'),
  importDependency('@vitejs/plugin-vue', '@vitejs/plugin-vue/dist/index.mjs'),
]);
let vueRuntime;
try {
  vueRuntime = fileURLToPath(import.meta.resolve('vue'));
} catch {
  vueRuntime = 'D:/Project/porto-rama/node_modules/vue/dist/vue.esm-bundler.js';
}

export default defineConfig({
  root,
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  plugins: [vueModule.default()],
  resolve: {
    alias: {
      vue: vueRuntime,
    },
  },
  build: {
    outDir: path.resolve(root, '../dist'),
    emptyOutDir: false,
    sourcemap: false,
    cssCodeSplit: false,
    lib: {
      entry: path.resolve(root, 'main.js'),
      name: 'DaniPortfolioAnimations',
      formats: ['iife'],
      fileName: () => 'portfolio-animations.js',
    },
    rollupOptions: {
      output: { assetFileNames: 'portfolio-animations.css' },
    },
  },
});
