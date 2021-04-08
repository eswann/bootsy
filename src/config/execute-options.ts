import { LogLevel } from './log-level'
import { Logger } from './logger'

export interface ExecuteOptions {
  autoMerge?: boolean
  logLevel?: LogLevel | string | number
  logger?: Logger
}
