import { logDuration, logFunctionStart } from './logging-util'
import { Config, ExecuteOptions } from '..'
import { isPlainObject, isFunction } from './type-util'

/**
 * Executes synchronous functions using the provided arguments
 * @param options The execute options
 * @param fns The functions to execute
 */
export function executeFunctions(options: ExecuteOptions, fns: Function[]) {
  return (...args: any[]) => {
    let result = execute(options, fns[0], args)
    for (let i = 1; i < fns.length; i++) {
      args = mergeResult(options, args, result)
      result = execute(options, fns[i], args)
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
    let result = await executeAsync(options, fns[0], args)
    for (let i = 1; i < fns.length; i++) {
      args = mergeResult(options, args, result)
      result = await executeAsync(options, fns[i], args)
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

export function mergeResult(options: ExecuteOptions, args: any[], result: any) {
  if (options.autoMerge && args?.length === 1 && result) {
    if (isPlainObject(args[0]) && isPlainObject(result)) {
      return { ...args[0], ...result }
    }
  }
  return result
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
      throw new Error(`${opName} requires at least one function`)
    }
    options = functionOrOptions
    execFns = fns
  }
  return { options: { ...Config.executeOptions, ...options }, execFns }
}
