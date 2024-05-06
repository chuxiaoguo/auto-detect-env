import { filter, forEach } from 'lodash-es'
import chalk from 'chalk'
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
  forEach(Object.entries(config), ([key, value], index) => {
    const isIncludeSensitiveWord = ignoreWords.some(
      word => key.toLowerCase().includes(word) || value.toLowerCase().includes(word)
    )
    if (isIncludeSensitiveWord) {
      existSensitiveWords.push(`${key}: ${value}`)
    }
  })
  return existSensitiveWords
}

export const detecting = (props: PropType) => {
  const { prodConfig, exclude, ignore } = props

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
  const sensitiveWords = ignore
    ? filter(DEFAULT_SENSITIVE_WORDS, word => ignore.includes(word))
    : DEFAULT_SENSITIVE_WORDS
  const existSensitiveWords = detectingSensitiveWords(prodConfig, sensitiveWords)

  if (existSensitiveWords.length) {
    console.log(chalk.red(`[detect-env] 检测到敏感词：${existSensitiveWords.join('\n')}`))
  }
}
