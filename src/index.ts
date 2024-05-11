import { defaults, isEmpty } from 'lodash-es'
import { DEFAULT_CONFIG, LevelEnum, resolveCacOption, resolveConfig } from './config'
import { isFileExists, readFileToObject } from './fs'
import { detecting } from './detection'
import { createHandleError } from './log'

export const startToDetecting = async (options: any): Promise<void> => {
  try {
    const config = !isEmpty(options)
      ? resolveCacOption(options)
      : await resolveConfig('./detectenv.json')
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

    const findSensitiveWordsInSentence = (sentence: string) => {
      return validSensitiveWords.find((word: string) => {
        return sentence.indexOf(word) > -1
      })
    }

    if (existSensitiveWords.length) {
      handleError(
        true,
        `[detect-env] 检测到敏感词：\n${existSensitiveWords.map((sentence: string) => `[${findSensitiveWordsInSentence(sentence)}] ${sentence}`).join('\n')}`
      )
    }

    if (existSameValueInDevAndProd.length) {
      handleError(
        true,
        `[detect-env] 检测到开发环境和生产环境存在相同配置：\n${existSameValueInDevAndProd.join('\n')}`
      )
    }
  } catch (error) {
    console.error('Error fetching config:', error.message)
  }
}
