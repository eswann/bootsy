import { LogLevel } from './log-level'
import { Logger } from './logger'
import { isString } from '../util/string-util'
import { ExecuteOptions } from './execute-options'

export class Config {
  public static defaultExecuteOptions: ExecuteOptions = {
    autoMerge: true,
    logger: console,
    logLevel: LogLevel.info,
  }

  public static initialize(defaultExecuteOptions: ExecuteOptions) {
    if (defaultExecuteOptions) {
      const { autoMerge, logger, logLevel } = defaultExecuteOptions
      if (autoMerge != null) {
        this.defaultExecuteOptions.autoMerge = autoMerge
      }
      if (logger != null) {
        this.defaultExecuteOptions.logger = logger
      }

      if (logLevel != null) {
        if (isString(logLevel)) {
          this.defaultExecuteOptions.logLevel = LogLevel[logLevel]
        } else if (logLevel in LogLevel) {
          this.defaultExecuteOptions.logLevel = logLevel as LogLevel
        }
        if (!this.defaultExecuteOptions.logLevel) {
          throw new Error(`Provided Lambduh log level is not valid: ${logLevel}`)
        }
      }
    }
  }
}
