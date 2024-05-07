import chalk from 'chalk'
import { LevelEnum } from './config'
chalk.level = 3

const isInfo = (level: LevelEnum) => level === LevelEnum.INFO
const isWarn = (level: LevelEnum) => level === LevelEnum.WARN
const isError = (level: LevelEnum) => level === LevelEnum.ERROR

const LEVEL_TO_COLOR = {
  [LevelEnum.INFO]: 'green',
  [LevelEnum.WARN]: 'yellow',
  [LevelEnum.ERROR]: 'red'
}

const printLog = (type: LevelEnum, ...message: string[]) => {
  console.log(chalk[LEVEL_TO_COLOR[type] as 'green' | 'yellow' | 'red'].bold(...message))
}

export const createHandleError = (level: LevelEnum) => {
  return (maybeExist: string | boolean, ...message: string[]): void => {
    const shouldExit = maybeExist === true
    const restMessage = shouldExit ? message : [maybeExist as string, ...message]
    if (isInfo(level)) {
      printLog(shouldExit ? LevelEnum.WARN : level, ...restMessage)
      return
    }
    if (isWarn(level)) {
      printLog(shouldExit ? LevelEnum.ERROR : level, ...restMessage)
      if (shouldExit) {
        process.exit(1)
      }
      return
    }
    if (isError(level)) {
      return process.exit(1)
    }
  }
}
