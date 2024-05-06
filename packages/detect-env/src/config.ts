// 写一个获取配置文件的方法，配置文件可以是多种文件类型，比如json、yaml、rc、ts、js等
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yamljs'

export interface ConfigType {
  include: string[]
  exclude: string[]
  ignore: string[]
  devFilePath: string
  prodFilePath: string
}

export const DEFAULT_CONFIG: ConfigType = {
  include: [],
  exclude: [],
  ignore: [],
  devFilePath: '.env.development',
  prodFilePath: '.env.production'
}

/**
 * 根据文件路径和类型获取配置对象
 * @param filePath 配置文件路径
 * @returns 解析后的配置对象
 */
export const resolveConfig = async (filePath: string): Promise<ConfigType> => {
  const ext = path.extname(filePath).toLowerCase()
  // let streamConfig

  switch (ext) {
    case '.json':
      return JSON.parse(await fs.promises.readFile(filePath, 'utf8'))
    case '.yaml':
    case '.yml':
      return yaml.load(filePath)
    // case '.js':
    // case '.ts':
    //   // 动态导入JS/TS文件作为模块
    //   return (await import(filePath)) || module
    // case 'package':
    //   if (packageJson.detectEnv) {
    //     return packageJson.detectEnv
    //   } else {
    //     throw new Error('No detect-env field found in package.json')
    //   }
    default:
      throw new Error('No detect-env field found in package.json')
    // streamConfig = fs.readFileSync(filePath, 'utf8')
    // return toml.parse(streamConfig) as ConfigType
  }
}
