import { execute, parseFunctionsAndOptions } from '../util/runner'
import { ExecuteOptions } from '../config'
import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction

/**
 * Provides an output function to run and await all input functions.
 * All functions are run with the same provided arguments
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions to run
 * @return Returns a function that accepts the args to kick off the composite function
 */
export function overAsync(
  functionOrOptions: Function | ExecuteOptions,
  ...fns: Array<Function>
): StandardFunction {
  const { options, execFns } = parseFunctionsAndOptions('overAsync', functionOrOptions, fns)

  return (...args) => {
    return Promise.all(execFns.map((fn) => execute(options, fn, ...args)))
  }
}
