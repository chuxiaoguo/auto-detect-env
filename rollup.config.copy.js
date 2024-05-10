// rollup.config.js
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import typescript from '@rollup/plugin-typescript'
import { rollup } from 'rollup'

// 假设这是你的所有入口文件
const entryPoints = ['src/index.ts', 'src/cli.ts']

// 先打包所有入口文件到内存，收集共享依赖
async function collectDependencies() {
  const dependencies = new Set()
  for (const entry of entryPoints) {
    const bundle = await rollup({
      input: entry,
      external: [], // 不将任何模块视为外部，以收集所有依赖
      plugins: [json(), resolve(), commonjs(), typescript()]
    })
    const { modules } = await bundle.generate({ format: 'esm' })
    for (const mod of Object.values(modules)) {
      if (mod.id.startsWith('node_modules')) {
        dependencies.add(mod.id)
      }
    }
    await bundle.close()
  }
  return dependencies
}

;(async () => {
  const sharedDeps = await collectDependencies()

  const vendorBundle = await rollup({
    input: Array.from(sharedDeps), // 将收集到的所有共享依赖作为输入
    external: [], // 不将任何模块视为外部
    plugins: [json(), resolve(), commonjs(), typescript()]
  })

  // 输出vendor文件
  await vendorBundle.write({
    dir: 'dist/vendor', // 输出目录
    format: 'cjs', // 或者其他你需要的格式
    exports: 'auto',
    sourcemap: true
  })

  // 现在为每个入口点创建单独的输出
  const config = entryPoints.map(entry => ({
    input: entry,
    output: [
      {
        file: `dist/${entry.split('/').pop().replace(/\.js$/, '')}.cjs`, // 根据入口文件名生成输出文件名
        format: 'cjs',
        exports: 'auto',
        sourcemap: true
      }
    ],
    external(id) {
      return sharedDeps.has(id) // 将共享依赖标记为外部，避免重复打包
    },
    plugins: [json(), resolve(), commonjs(), typescript()]
  }))

  // 打包入口文件
  for (const conf of config) {
    const bundle = await rollup(conf)
    await bundle.write(conf.output[0])
    await bundle.close()
  }

  console.log('Build complete.')
})()
