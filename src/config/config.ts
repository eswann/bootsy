import { LogLevel } from './log-level'
import { isString } from '../util/type-util'
import { ExecuteOptions } from './execute-options'

export class Config {
  public static executeOptions: ExecuteOptions = {
    autoMerge: true,
    logger: console,
    logLevel: LogLevel.info,
    logTimings: false,
  }

  public static reset() {
    this.executeOptions = {
      autoMerge: true,
      logger: console,
      logLevel: LogLevel.info,
    }
  }

  public static initialize(executeOptions: ExecuteOptions) {
    if (executeOptions) {
      const { autoMerge, logger, logLevel, logTimings } = executeOptions
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
          throw new Error(`Bootsy: Provided Bootsy log level is not valid: ${logLevel}`)
        }
      }

      if (logTimings != null) {
        this.executeOptions.logTimings = logTimings
      }
    }
  }
}
