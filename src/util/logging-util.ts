import { ExecuteOptions, LogLevel } from '..'
import { performance } from 'perf_hooks'

/**
 * Logs the start time of a function
 * @param options Options to apply to runtime execution
 * @param fn The function
 * @param args
 */
export function logFunctionStart(options: ExecuteOptions, fn: Function, args: any[]) {
  if (options.logLevel >= LogLevel.debug) {
    options.logger.debug(`Calling function ${fn.name} with args`, { ...args })
    return performance.now()
  }
}

/**
 * Logs the duration of a function given the start time
 * @param options Options to apply to runtime execution
 * @param fn The function
 * @param startTime Time the function execution started
 */
export function logDuration(options: ExecuteOptions, fn: Function, startTime: number) {
  if (startTime) {
    const duration = performance.now() - startTime
    options.logger.debug(`Stopwatch - Function: ${fn.name}, Duration: ${duration} ms`)
    return duration
  }
}
