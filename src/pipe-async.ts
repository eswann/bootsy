import { executeAsync } from './util/runner'
import { FunctionTypes } from './util/type-util'
import AsyncFunction = FunctionTypes.AsyncFunction

/**
 * Performs left-to-right function composition on async code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param fns The functions to compose
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipeAsync (...fns): AsyncFunction {
  if (fns.length === 0) {
    throw new Error('pipe-async requires at least one function')
  }
  return async (...args) => {
    let result = await executeAsync(fns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      result = await executeAsync(fns[i], result)
    }
    return result
  }
}
