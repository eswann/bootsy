import { FunctionTypes, isAsync, isPlainObject } from '../util/type-util'
import ObjectFunction = FunctionTypes.ObjectFunction

/**
 * This works like partial, but instead of having arguments inline, it merges the arguments
 * This is used when we use parameter destructuring rather than a parameter list
 * Taken from rambda partialCurry (not ramda)
 * @param fn The function to call
 * @param arg The partial arguments provided
 */
export function curryMerge(fn: Function, arg: Object = {}): ObjectFunction {
  if (!isPlainObject(arg)) {
    return fn(arg)
  }

  return (rest) => {
    if (isAsync(fn)) {
      return new Promise((resolve, reject) => {
        fn({ ...rest, ...arg })
          .then(resolve)
          .catch(reject)
      })
    }
    return fn({ ...rest, ...arg })
  }
}
