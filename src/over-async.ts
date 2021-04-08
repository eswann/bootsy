import { executeAsync } from './util/runner'
import { FunctionTypes } from './util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Provides an output function to run and await all input functions.
 * All functions are run with the same provided arguments
 * @param fns The functions to compose
 * @return Returns a function that accepts the args to kick off the composite function
 */
export function overAsync (...fns: Function[]): StandardFunction {
  if (fns.length === 0) {
    throw new Error('over requires at least one function')
  }
  return (...args) => {
    return Promise.all(fns.map((fn) => executeAsync(fn, ...args)))
  }
}
