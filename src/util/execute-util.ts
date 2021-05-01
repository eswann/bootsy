import { ExecuteOptions } from '../config'
import { isFunction, isPlainObject } from './type-util'

export function validateFunction(fn: Function) {
  if (!fn || !isFunction(fn)) {
    throw new Error('Bootsy: Function to execute is not a function')
  }
}

export function handleError(options: ExecuteOptions, fn: Function, err: Error) {
  if (options.logger) {
    options.logger.error(`Function: ${fn.name} failed with error`, err)
  }
  throw err
}

export function mergeResult(options: ExecuteOptions, args: any[], result: any) {
  if (options.autoMerge && args?.length === 1 && result) {
    if (isPlainObject(args[0]) && isPlainObject(result)) {
      return { ...args[0], ...result }
    }
  }
  return result
}
