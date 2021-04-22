import { LogLevel } from './log-level'
import { isString } from '../util/type-util'
import { ExecuteOptions } from './execute-options'

export class Config {
  public static executeOptions: ExecuteOptions = {
    autoMerge: true,
    logger: console,
    logLevel: LogLevel.info,
  }

  public static reset() {
    this.executeOptions = {
      autoMerge: true,
      autoMergeArrays: false,
      dedupeMergedArrays: false,
      logger: console,
      logLevel: LogLevel.info,
    }
  }

  public static initialize(executeOptions: ExecuteOptions) {
    if (executeOptions) {
      const { autoMerge, logger, logLevel } = executeOptions
      if (autoMerge != null) {
        this.executeOptions.autoMerge = autoMerge
      }
      if (logger != null) {
        this.executeOptions.logger = logger
      }

      if (logLevel != null) {
        if (isString(logLevel)) {
          this.executeOptions.logLevel = LogLevel[logLevel]
        } else if (logLevel in LogLevel) {
          this.executeOptions.logLevel = logLevel as LogLevel
        }
        if (!this.executeOptions.logLevel) {
          throw new Error(`Provided Lambduh log level is not valid: ${logLevel}`)
        }
      }
    }
  }
}
