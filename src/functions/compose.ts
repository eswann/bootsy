import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction
import AsyncFunction = FunctionTypes.AsyncFunction
import { ExecuteOptions } from '../config'
import { executeFunctions, executeFunctionsAsync, parseFunctionsAndOptions } from '../util/runner'

/**
 * Performs right-to-left function composition on code. The rightmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions to compose
 * @return Returns a composed function that accepts the args to kick off the pipe
 */
export function compose(
  functionOrOptions: Function | ExecuteOptions,
  ...fns: Array<Function>
): StandardFunction {
  const { options, execFns } = parseFunctionsAndOptions('compose', functionOrOptions, fns)
  return executeFunctions(options, execFns.reverse())
}

/**
 * Performs right-to-left function composition on async code. The rightmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions to compose
 * @return Returns a composed function that accepts the args to kick off the pipe
 */
export function composeAsync(
  functionOrOptions: Function | ExecuteOptions,
  ...fns: Array<Function>
): AsyncFunction {
  const { options, execFns } = parseFunctionsAndOptions('composeAsync', functionOrOptions, fns)
  return executeFunctionsAsync(options, execFns.reverse())
}
