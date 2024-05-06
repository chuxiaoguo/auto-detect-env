import fs from 'node:fs'
import dotenv from 'dotenv'

export const isFileExists = (filePath: string): boolean => {
  return fs.existsSync(filePath)
}

export const readFileToObject = async (filepath: string): Promise<Record<string, string>> => {
  const streamConfig = fs.readFileSync(filepath, 'utf8')
  return dotenv.parse(streamConfig) as Record<string, string>
}
