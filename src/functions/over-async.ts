import { executeAsync, parseFunctionsAndOptions } from '../util/runner'
import { ExecuteOptions } from '../config'
import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Provides an output function to run and await all input functions.
 * All functions are run with the same provided arguments
 * @param fns First entry may be ExecuteOptions, otherwise Functions to pipe
 * @return Returns a function that accepts the args to kick off the composite function
 */
export function overAsync(...fns: Array<Function | ExecuteOptions>): StandardFunction {
  const { options, execFns } = parseFunctionsAndOptions('overAsync', fns)

  return (...args) => {
    return Promise.all(execFns.map((fn) => executeAsync(options, fn, ...args)))
  }
}
