// 写一个获取配置文件的方法，配置文件可以是多种文件类型，比如json、yaml、rc、ts、js等
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'yamljs'

/**
 * 日志级别
 * @default 'warn'
 * @enum {'info'} 表示不会退出进程，只会打印警告信息
 * @enum {'warn'} 表示不会退出进程，只有检测到敏感词或相同的内容时才会退出进程，并打印警告信息
 * @enum {'error'} 表示检测到异常项（空配置、敏感词、相同的内容）会退出进程，并打印错误信息
 */
export const enum LevelEnum {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export const DEFAULT_CONFIG: ConfigType = {
  include: [],
  exclude: [],
  ignore: [],
  devFilePath: '.env.development',
  prodFilePath: '.env.production'
}
export interface ConfigType {
  include: string[]
  exclude: string[]
  ignore: string[]
  devFilePath: string
  prodFilePath: string
  level?: LevelEnum
}

export interface CacOptions {
  e: string[]
  i: string[]
  l: LevelEnum
  dev: string
  prod: string
}

const KeySemantic = {
  e: 'exclude',
  i: 'ignore',
  l: 'level',
  dev: 'devFilePath',
  prod: 'prodFilePath'
} as Record<string, string>

export const resolveCacOption = <T extends CacOptions & Record<string, string>>(
  options: T
): ConfigType => {
  const semanticOptions: ConfigType & Record<string, any> = {} as ConfigType
  Object.keys(options).forEach(simpleKey => {
    semanticOptions[KeySemantic[simpleKey]] = options[simpleKey]
  })
  return semanticOptions
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
    //   动态导入JS/TS文件作为模块
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
