const { expect } = require('chai')
const { getType } = require('../dist/util/type-util')
const { curryMerge } = require('../dist')

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
      new Promise((resolve) => {
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
