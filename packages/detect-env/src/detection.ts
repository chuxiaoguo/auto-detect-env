import { filter, forEach, isEmpty } from 'lodash-es'
import type { ConfigType } from './config'

type PropType = { devConfig: Record<string, string>; prodConfig: Record<string, string> } & Pick<
  ConfigType,
  'include' | 'exclude' | 'ignore'
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

const detectingSameValueInDevAndProd = (
  devConfig: Record<string, string>,
  prodConfig: Record<string, string>
) => {
  // 排除devConfig与prodConfig中相同的value值, 此部分只会针对url
  const existSameValueInDev: string[] = []
  const isHostURL = (url: string) => url.startsWith('http') || url.startsWith('https')
  forEach(Object.entries(prodConfig), ([key, value]) => {
    if (devConfig[key] === value && isHostURL(value)) {
      existSameValueInDev.push(value)
    }
  })
  return existSameValueInDev
}

export const detecting = (
  props: PropType
): {
  existSameValueInDevAndProd: string[]
  existSensitiveWords: string[]
  sensitiveWords: string[]
} => {
  const { prodConfig, devConfig, exclude, ignore } = props

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
  const sensitiveWords = isEmpty(ignore)
    ? filter(DEFAULT_SENSITIVE_WORDS, word => ignore.includes(word))
    : DEFAULT_SENSITIVE_WORDS
  const existSensitiveWords = detectingSensitiveWords(prodConfig, sensitiveWords)

  // 相同值检测
  const existSameValueInDevAndProd = detectingSameValueInDevAndProd(prodConfig, devConfig)

  return {
    existSensitiveWords,
    existSameValueInDevAndProd,
    sensitiveWords
  }
}
