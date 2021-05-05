import { expect } from 'chai'
import { getType } from '../test-helpers/type-helper'
import { curry, curryMerge } from '../../src'

describe('curryMerge', () => {
  it('should create and execute a merged partial function', () => {
    const fn = ({ a, b, c }) => a + b + c
    const curried = curryMerge(fn, { a: 1 })

    expect(getType(curried)).to.equal('Function')
    expect(
      curried({
        b: 2,
        c: 3,
      })
    ).to.equal(6)
  })

  // it('should create and execute a merged partial function in multiple steps', () => {
  //   const fn = ({ a, b, c }) => a + b + c
  //   const curried = curryMerge(fn, { a: 1 })
  //   const curriedWithAnotherArg = curried({ b: 2 })
  //   expect(getType(curriedWithAnotherArg)).to.equal('Function')
  //   expect(
  //     curried({
  //       c: 3,
  //     })
  //   ).to.equal(6)
  // })

  it('should create and execute a merged complete function', () => {
    const fn = ({ a, b, c }) => a + b + c
    const curried = curryMerge(fn, { a: 1, b: 2, c: 3 })

    expect(getType(curried)).to.equal('Function')
    expect(curried()).to.equal(6)
  })

  it('should execute a function with no arguments', () => {
    const fn = () => 'Sup!'
    const curried = curryMerge(fn, null)
    expect(curried()).to.equal('Sup!')
  })

  it('should curry a function with a single string argument', () => {
    const returnAString = (a) => a
    const curriedReturnAString = curryMerge(returnAString)
    const result = curriedReturnAString('test1')

    expect(result).to.equal('test1')
  })

  it('should execute function with a single string argument with arg supplied', () => {
    const returnAString = (a) => a
    const curried = curryMerge(returnAString, 'test1')

    expect(curried()).to.equal('test1')
  })

  it('should work with promise', (done) => {
    const delay = ({ ms, x }) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(x * 2)
        }, ms)
      })

    const curried = curryMerge(delay, { ms: 200 })

    curried({ x: 3 }).then(() => {
      expect(getType(curried)).to.equal('Function')
      done()
    })
  })

  it('should work with async', async () => {
    const delay = (ms) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve()
        }, ms)
      })

    const fn = async ({ a, b, c }) => {
      await delay(100)

      return a + b + c
    }

    const curried = curryMerge(fn, { a: 1 })

    const result = await curried({
      b: 2,
      c: 3,
    })

    expect(result).to.equal(6)
  })
})
