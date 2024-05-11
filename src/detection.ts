import { filter, forEach, isEmpty } from 'lodash-es'
import type { ConfigType } from './config'

type PropType = { devConfig: Record<string, string>; prodConfig: Record<string, string> } & Pick<
  ConfigType,
  'exclude' | 'ignoreWord' | 'sensitiveWord'
>

const DEFAULT_SENSITIVE_WORDS = [
  'uat',
  'fat',
  'qa',
  'mock',
  'http',
  'localhost',
  'dev',
  'development',
  'proxy'
]

const detectingSensitiveWords = (
  config: Record<string, string>,
  ignoreWords: string[]
): string[] => {
  const existSensitiveWords: string[] = []
  forEach(Object.entries(config), ([key, value]) => {
    const isIncludeSensitiveWord = ignoreWords.some(word => {
      if (word === 'http') {
        const lowerCaseValue = value.toLowerCase()
        return lowerCaseValue.includes('http') && !lowerCaseValue.includes('https')
      }
      return key.toLowerCase().includes(word) || value.toLowerCase().includes(word)
    })
    if (isIncludeSensitiveWord) {
      existSensitiveWords.push(`${key}: ${value}`)
    }
  })
  return existSensitiveWords
}

const detectingSameHostInDevAndProd = (
  devConfig: Record<string, string>,
  prodConfig: Record<string, string>
) => {
  // 排除devConfig与prodConfig中相同的value值, 此部分只会针对url
  const existSameHostInDev: string[] = []
  const isHostURL = (url: string) => url.startsWith('http') || url.startsWith('https')
  forEach(Object.entries(prodConfig), ([key, value]) => {
    if (devConfig[key] === value && isHostURL(value)) {
      existSameHostInDev.push(value)
    }
  })
  return existSameHostInDev
}

export const detecting = (
  props: PropType
): {
  existSameValueInDevAndProd: string[]
  existSensitiveWords: string[]
  validSensitiveWords: string[]
} => {
  const { prodConfig, devConfig, exclude, ignoreWord, sensitiveWord } = props

  // 排除prodConfig中白名单部分
  Object.entries(prodConfig).forEach(([key, value]) => {
    if (exclude.includes(key)) {
      delete prodConfig[key]
      return
    }
    if (exclude.includes(value)) {
      delete prodConfig[key]
    }
  })

  // 敏感词检测
  const mergeSensitiveWords = [...DEFAULT_SENSITIVE_WORDS, ...sensitiveWord]
  const validSensitiveWords = !isEmpty(ignoreWord)
    ? filter(mergeSensitiveWords, word => ignoreWord.includes(word))
    : mergeSensitiveWords
  const existSensitiveWords = detectingSensitiveWords(prodConfig, validSensitiveWords)

  // 相同值检测
  const existSameValueInDevAndProd = detectingSameHostInDevAndProd(prodConfig, devConfig)

  return {
    existSensitiveWords,
    existSameValueInDevAndProd,
    validSensitiveWords
  }
}
