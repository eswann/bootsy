import { expect } from 'chai'
import { validateFunction, mergeResult } from '../../src/util/execute-util'

describe('execute util', function () {
  describe('validateFunction', function () {
    it('Should err if not function', () => {
      // @ts-ignore
      expect(() => validateFunction('test')).to.throw
    })

    it('Should err if function null', () => {
      // @ts-ignore
      expect(() => validateFunction(null)).to.throw
    })

    it('Should not err if function', () => {
      expect(() => validateFunction(() => {})).to.not.throw
    })
  })

  describe('mergeResult', function () {
    it('Should merge result if autoMerge on and arguments are objects', () => {
      const result = { test2: 'test2' }
      const mergedResult = mergeResult({ autoMerge: true }, [{ test: 'test' }], result)
      expect(mergedResult).to.deep.equal({ test: 'test', test2: 'test2' })
    })

    it('Should not merge result if autoMerge off', () => {
      const result = { test2: 'test2' }
      const mergedResult = mergeResult({ autoMerge: false }, [{ test: 'test' }], result)
      expect(mergedResult).to.equal(result)
    })

    it('Should not merge result if autoMerge on both arguments are string', () => {
      const result = 'test2'
      const mergedResult = mergeResult({ autoMerge: true }, ['test'], result)
      expect(mergedResult).to.deep.equal(result)
    })

    it('Should not merge result if autoMerge on both arguments are numbers', () => {
      const result = 5
      const mergedResult = mergeResult({ autoMerge: true }, [10], result)
      expect(mergedResult).to.deep.equal(result)
    })

    it('Should not merge result if autoMerge on and result is string', () => {
      const result = 'test2'
      const mergedResult = mergeResult({ autoMerge: true }, [{ test: 'test' }], result)
      expect(mergedResult).to.deep.equal(result)
    })

    it('Should not merge result if autoMerge on and argument is string', () => {
      const result = { test: 'test' }
      const mergedResult = mergeResult({ autoMerge: true }, ['test2'], result)
      expect(mergedResult).to.deep.equal(result)
    })

    it('Should not merge result if autoMerge on and multiple arguments supplied', () => {
      const result = { test2: 'test2' }
      const mergedResult = mergeResult(
        { autoMerge: true },
        [{ test: 'test' }, { test: 'test3' }],
        result
      )
      expect(mergedResult).to.deep.equal(result)
    })
  })
})
