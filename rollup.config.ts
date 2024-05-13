import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import bundleAnalyzer from 'rollup-plugin-bundle-analyzer'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const BasePlugin = [
  typescript({
    tsconfig: path.resolve(__dirname, 'tsconfig.json')
  }),
  resolve({ preferBuiltins: true }),
  commonjs(),
  // builtins(),
  // globals(),
  json(),
  bundleAnalyzer({})
]

export default defineConfig([
  {
    input: 'src/index.ts',
    plugins: BasePlugin,
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto'
    }
  },
  {
    input: 'src/cli.ts',
    plugins: BasePlugin,
    output: {
      file: 'dist/cli.cjs',
      format: 'cjs',
      exports: 'auto'
    }
  }
])
