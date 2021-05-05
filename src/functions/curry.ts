import { FunctionTypes, isPlainObject } from '../util/type-util'
import StandardFunction = FunctionTypes.StandardFunction
import { Config } from '../config'
import { curryMerge } from './curry-merge'

/**
 * Returns a curried version of the function.
 * The curried function can be called with some or all of the args
 * and will be evaluated when the last argument is provided.
 * Taken from rambda (not ramda)
 * @param fn The function to transform to a curried function
 * @param args Required for the currying recursion (don't use this)
 * @returns The curried function or a result if all arguments are fulfilled
 */
export function curry(fn: Function, ...args: any[]): StandardFunction {
  const fnArgCount = fn.length

  // Apply curryMerge instead if this is a single or zero arg function
  if (Config.executeOptions.curryMerge && fnArgCount === 1) {
    return curryMerge(fn, args && args[0])
  }

  return classicCurry(fn, ...args)
}

function classicCurry(fn: Function, ...args: any[]) {
  return (...rest: any[]) => {
    if (args.length + rest.length >= fn.length) {
      return fn(...args, ...rest)
    }
    return classicCurry(fn, ...[...args, ...rest])
  }
}
