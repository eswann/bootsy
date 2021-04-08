import { logDuration, logFunctionStart } from './logging-util'
import { Config, ExecuteOptions } from '..'
const { logger } = Config

/**
 * Executes the provided function asynchronously.
 * Function is wrapped in metrics, set logging to debug for timers
 * @param options Options to apply to runtime execution
 * @param fn The function to execute
 * @param args Args to pass to the function
 * @return Result of function execution
 */
export async function executeAsync(
  options: ExecuteOptions,
  fn: Function,
  ...args: any[]
): Promise<any> {
  if (!fn || typeof fn !== 'function') {
    throw new Error('function passed to executeAsync was not a function.')
  }
  let startTime = logFunctionStart(fn, ...args)
  try {
    const result = fn(...args)
    if (result && typeof result.then === 'function') {
      // Skip await if no reason to
      return await result
    }
    return result
  } catch (err) {
    logger.error(`Function: ${fn.name} failed with error`, err)
    throw err
  } finally {
    logDuration(fn, startTime)
  }
}

/**
 * Executes the provided function synchronously.
 * Function is wrapped in metrics, set logging to debug for timers
 * @param fn The function to execute
 * @param args Args to pass to the function
 * @return Result of function execution
 */
export function execute(fn: Function, ...args: any[]): any {
  let startTime = logFunctionStart(fn, ...args)
  try {
    return fn(...args)
  } catch (err) {
    logger.error(`Function: ${fn.name} failed with error`, err)
    throw err
  } finally {
    logDuration(fn, startTime)
  }
}
