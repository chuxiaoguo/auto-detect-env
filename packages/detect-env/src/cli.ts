import cac from 'cac'
import { version } from '../package.json'
import { startToDetecting } from '.'
const cli = cac('detect-env')

cli
  .command('[...root]', '检测生产环境的配置文件，对存在异常的配置抛出异常或终止进程')
  .option('-i [ignore]', '添加需要忽略的敏感词', {
    default: []
  })
  .option('-s [sensitiveWord]', '添加需要校验的敏感词', {
    default: []
  })
  .option('-dev [devFilePath]', '添加dev环境的路径配置', {
    default: './env.development'
  })
  .option('-prod [prodFilePath]', '添加prod环境的路径配置', {
    default: './env.production'
  })
  .option('-l [level]', '添加告警等级', {
    default: 'warn'
  })
  .option('-e [exclude]', '添加需要忽略的配置(可以是key,也可以是value)', {
    default: []
  })
  .action(async (commander, options) => {
    await startToDetecting(options)
  })

cli.help()
cli.version(version)
cli.parse()
