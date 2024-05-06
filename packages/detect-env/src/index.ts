import { isEmpty } from 'lodash-es'
import chalk from 'chalk'
import { DEFAULT_CONFIG, resolveConfig } from './config'
import { isFileExists, readFileToObject } from './fs'

chalk.level = 3
;(async () => {
  try {
    const config = await resolveConfig('./auto-detect-env.json')
    const mergeConfig = !isEmpty(config) ? config : DEFAULT_CONFIG
    const { include, exclude, ignore, devFilePath, prodFilePath } = mergeConfig

    // 判断配置文件是否存在
    if (!isFileExists(devFilePath)) {
      console.log(chalk.yellow.bold(`${devFilePath} is not exists!`))
      return
    }

    if (!isFileExists(prodFilePath)) {
      console.log(chalk.red.bold(`${prodFilePath} is not exists!`))
      return
    }

    const devConfig = await readFileToObject(devFilePath)
    const prodConfig = await readFileToObject(prodFilePath)

    if (isEmpty(devConfig)) {
      console.log(chalk.red.bold(`devConfig is empty!`))
      return
    }

    if (isEmpty(prodConfig)) {
      console.log(chalk.red.bold(`prodConfig is empty!`))
      return
    }

    console.log(devConfig, prodConfig)
  } catch (error) {
    console.error('Error fetching config:', error.message)
  }
})()
