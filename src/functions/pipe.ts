import { executeFunctions, executeFunctionsAsync, parseFunctionsAndOptions } from '../util/runner'
import { ExecuteOptions } from '../config'
import { FunctionTypes } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction
import AsyncFunction = FunctionTypes.AsyncFunction

/**
 * Performs left-to-right function composition on code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions to pipe
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipe(
  functionOrOptions: Function | ExecuteOptions,
  ...fns: Array<Function>
): StandardFunction {
  const { options, execFns } = parseFunctionsAndOptions('pipe', functionOrOptions, fns)
  return executeFunctions(options, execFns)
}

/**
 * Performs left-to-right function composition on async code. The leftmost function may have
 * any arity; the remaining functions must be unary.
 * Function is wrapped in error handling and metrics, set logging to debug for timers
 * @param functionOrOptions The first function or execute options
 * @param fns Additional functions to pipe
 * @return Returns a function that accepts the args to kick off the pipe
 */
export function pipeAsync(
  functionOrOptions: Function | ExecuteOptions,
  ...fns: Array<Function>
): AsyncFunction {
  const { options, execFns } = parseFunctionsAndOptions('pipeAsync', functionOrOptions, fns)
  return executeFunctionsAsync(options, execFns)
}
