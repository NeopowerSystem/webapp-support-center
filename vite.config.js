import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

export default defineConfig(({ mode }) => ({
  cacheDir: '.vite-cache',
  plugins: [
    react(),
    {
      name: 'support-center-types',
      apply: 'build',
      generateBundle() {
        if (mode !== 'library') return
        this.emitFile({
          type: 'asset',
          fileName: 'index.d.ts',
          source: readFileSync(new URL('./src/index.d.ts', import.meta.url), 'utf8'),
        })
      },
    },
  ],
  build: mode === 'library'
    ? {
        lib: {
          entry: 'src/index.js',
          formats: ['es'],
          fileName: 'support-center',
          cssFileName: 'styles',
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime', 'lucide-react'],
        },
      }
    : { outDir: 'demo-dist' },
}))
