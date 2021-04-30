import { Config, ExecuteOptions } from '..'
import { handleError, mergeResult, validateFunction } from './execute-util'
import { isFunction } from './type-util'
import { logDuration, logFunctionStart } from './logging-util'

/**
 * Executes synchronous functions using the provided arguments
 * @param options The execute options
 * @param fns The functions to execute
 */
export function executeFunctions(options: ExecuteOptions, fns: Function[]) {
  return (...args: any[]) => {
    let result = execute(options, fns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      const nextArgs = mergeResult(options, args, result)
      result = execute(options, fns[i], nextArgs)
    }
    return result
  }
}

/**
 * Executes synchronous functions using the provided arguments
 * @param options The execute options
 * @param fns The functions to execute
 */
export function executeFunctionsAsync(options: ExecuteOptions, fns: Function[]) {
  return async (...args: any[]) => {
    let result = await executeAsync(options, fns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      const nextArgs = mergeResult(options, args, result)
      result = await executeAsync(options, fns[i], nextArgs)
    }
    return result
  }
}

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
  let startTime = logFunctionStart(options, fn, args)
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
  let startTime = logFunctionStart(options, fn, args)
  try {
    return fn(...args)
  } catch (err) {
    handleError(options, fn, err)
  } finally {
    logDuration(options, fn, startTime)
  }
}

/**
 * Parses arguments passed to a function to determine if the first element is an option or a function
 * @param opName Operation that is calling this method (ex: pipe/compose)
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions
 * @returns parsed options and functions
 */
export function parseFunctionsAndOptions(
  opName: string,
  functionOrOptions: Function | ExecuteOptions,
  fns?: Array<Function>
): { options: ExecuteOptions; execFns: Function[] } {
  let options, execFns
  if (isFunction(functionOrOptions)) {
    execFns = [functionOrOptions, ...fns]
  } else {
    if (!fns || !fns.length) {
      throw new Error(`Bootsy: ${opName} requires at least one function`)
    }
    options = functionOrOptions
    execFns = fns
  }
  return { options: { ...Config.executeOptions, ...options }, execFns }
}
