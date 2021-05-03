import { LogLevel } from './log-level'
import { Logger } from './logger'

export interface ExecuteOptions {
  autoMerge?: boolean
  logger?: Logger
  logLevel?: LogLevel | string | number
  logTimings?: boolean
  curryMerge?: boolean
}
