import path from 'node:path'
import { defaults, isEmpty } from 'lodash-es'
import chalk from 'chalk'
import { DEFAULT_CONFIG, LevelEnum, resolveCacOption, resolveConfig } from './config'
import { isFileExists, readFileToObject } from './fs'
import type { DetectingType } from './detection'
import { detecting } from './detection'
import { createHandleError } from './log'

chalk.level = 3
export const startToDetecting = async (options: any): Promise<DetectingType | undefined> => {
  try {
    const config = !isEmpty(options)
      ? resolveCacOption(options)
      : await resolveConfig(path.resolve(process.cwd(), './detect-env.json'))
    const {
      exclude,
      ignoreWord,
      sensitiveWord,
      devFilePath,
      prodFilePath,
      level = LevelEnum.WARN
    } = defaults(config ?? {}, DEFAULT_CONFIG)
    const handleError = createHandleError(level)

    if (!isFileExists(devFilePath)) {
      handleError(`${devFilePath} is not exists!`)
      return
    }

    if (!isFileExists(prodFilePath)) {
      handleError(`${prodFilePath} is not exists!`)
      return
    }

    const devConfig = await readFileToObject(devFilePath)
    const prodConfig = await readFileToObject(prodFilePath)

    if (isEmpty(devConfig)) {
      handleError(`devConfig is empty!`)
      return
    }

    if (isEmpty(prodConfig)) {
      handleError(`prodConfig is empty!`)
      return
    }

    const { existSameValueInDevAndProd, existSensitiveWords, validSensitiveWords } = detecting({
      exclude,
      ignoreWord,
      sensitiveWord,
      devConfig,
      prodConfig
    })

    console.log(
      chalk.green('配置清单：'),
      chalk.green(
        JSON.stringify(
          {
            exclude,
            ignoreWord,
            sensitiveWord,
            validSensitiveWords,
            devFilePath,
            prodFilePath
          },
          null,
          2
        )
      )
    )

    if (existSensitiveWords.length) {
      handleError(
        true,
        `[detect-env] 检测到敏感词：\n${existSensitiveWords
          .map(({ key, value, sensitiveWord }) => `[${sensitiveWord}] ${key}: ${value}`)
          .join('\n')}`
      )
    }

    if (existSameValueInDevAndProd.length) {
      handleError(
        true,
        `[detect-env] 检测到开发环境和生产环境存在相同配置：\n${existSameValueInDevAndProd.join('\n')}`
      )
    }

    console.log(chalk.green('检测完成'))
    return {
      existSameValueInDevAndProd,
      existSensitiveWords,
      validSensitiveWords
    }
  } catch (error) {
    console.error('Error fetching config:', error.message)
    throw new Error(error.message)
  }
}
