const { performance } = require('perf_hooks')
import {Config, LogLevel} from '../config'

/**
 * Logs the start time of a function
 * @param fn The function
 * @param args
 */
export function logFunctionStart(fn: Function, ...args: any[]) {
  if (Config.logLevel >= LogLevel.debug) {
    Config.logger.debug(`Calling function ${fn.name} with args`, {...args})
    return performance.now()
  }
}

export function logDuration(fn: Function, startTime: number) {
  if (startTime) {
    const duration = performance.now() - startTime
    Config.logger.debug(`Stopwatch - Function: ${fn.name}, Duration: ${duration} ms`)
    return duration
  }
}
