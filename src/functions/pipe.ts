import { execute, executeAsync, parseFunctionsAndOptions } from '../util/runner'
import { ExecuteOptions } from '../config'
import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction
import AsyncFunction = FunctionTypes.AsyncFunction

/**
 * Performs left-to-right function composition on code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param fns First entry may be ExecuteOptions, otherwise Functions to pipe
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipe(...fns: Array<Function | ExecuteOptions>): StandardFunction {
  const { options, execFns } = parseFunctionsAndOptions('pipe', fns)

  return (...args) => {
    let result = execute(options, execFns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      result = execute(options, execFns[i], result)
    }
    return result
  }
}

/**
 * Performs left-to-right function composition on async code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param fns First entry may be ExecuteOptions, otherwise Functions to pipe
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipeAsync(...fns: Array<Function | ExecuteOptions>): AsyncFunction {
  const { options, execFns } = parseFunctionsAndOptions('pipeAsync', fns)

  return async (...args) => {
    let result = await executeAsync(options, execFns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      result = await executeAsync(options, execFns[i], result)
    }
    return result
  }
}
