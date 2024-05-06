import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  input: 'src/index.ts',
  plugins: [
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json')
    })
  ],
  output: [
    {
      file: 'dist/index.js',
      format: 'es'
    }
  ]
})
