import { execute } from './util/runner'
import { FunctionTypes } from './util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Performs left-to-right function composition on code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param fns The functions to compose
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipe(...fns: Function[]): StandardFunction {
  if (fns.length === 0) {
    throw new Error('pipe requires at least one function')
  }
  return (...args) => {
    let result = execute(fns[0], ...args)
    for (let i = 1; i < fns.length; i++) {
      result = execute(fns[i], result)
    }
    return result
  }
}
