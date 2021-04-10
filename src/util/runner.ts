import { logDuration, logFunctionStart } from './logging-util'
import { Config, ExecuteOptions } from '..'
import { isFunction } from './type-util'

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
  validateFunction(fn)
  let startTime = logFunctionStart(options, fn, ...args)
  try {
    const result = fn(...args)
    if (result && typeof result.then === 'function') {
      // Skip await if no reason to
      return await result
    }
    return result
  } catch (err) {
    handleError(options, fn, err)
  } finally {
    logDuration(options, fn, startTime)
  }
}

/**
 * Executes the provided function synchronously.
 * Function is wrapped in metrics, set logging to debug for timers
 * @param options Options to apply to runtime execution
 * @param fn The function to execute
 * @param args Args to pass to the function
 * @return Result of function execution
 */
export function execute(options: ExecuteOptions, fn: Function, ...args: any[]): any {
  validateFunction(fn)
  let startTime = logFunctionStart(options, fn, ...args)
  try {
    return fn(...args)
  } catch (err) {
    handleError(options, fn, err)
  } finally {
    logDuration(options, fn, startTime)
  }
}

export function validateFunction(fn: Function) {
  if (!fn || typeof fn !== 'function') {
    throw new Error('Bootsy: function passed to executeAsync was not a function.')
  }
}

export function handleError(options: ExecuteOptions, fn: Function, err: Error) {
  if (options.logger) {
    options.logger.error(`Function: ${fn.name} failed with error`, err)
  }
  throw err
}

/**
 * Parses arguments passed to a function to determine if the first element is an option or a function
 * @param opName Operation that is calling this method (ex: pipe/compose)
 * @param fns Additional functions to pipe
 * @returns parsed options and functions
 */
export function parseFunctionsAndOptions(opName: string, fns: Array<Function | ExecuteOptions>) {
  if (!fns || fns.length === 0) {
    throw new Error(`${opName} requires at least one function`)
  }

  let options, execFns
  const first = fns[0]
  if (isFunction(first)) {
    execFns = fns
  } else {
    options = first
    execFns = fns.slice(1)
  }

  if (execFns.length === 0) {
    throw new Error(`${opName} requires at least one function`)
  }

  return {
    options: { ...Config.executeOptions, ...options },
    execFns,
  }
}
