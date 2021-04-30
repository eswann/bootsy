import { pipe, pipeAsync } from '../../src'
import { performance } from 'perf_hooks'
import { expect } from 'chai'

const testFunc1 = (rootText) => {
  return `${rootText} the cat and the fiddle`
}

const testFunc2 = (rootText) => {
  return `${rootText} the cow jumped over the moon`
}

const testMergeFunc1 = ({ text1 }) => {
  return { text2: 'the cat and the fiddle' }
}

const testMergeFunc2 = ({ text1, text2 }) => {
  const text3 = 'the cow jumped over the moon'
  return { text: `${text1} ${text2} ${text3}` }
}

describe('pipe', () => {
  it('Throws if no functions are passed', () => {
    // @ts-ignore
    expect(() => pipe()).to.throw(/requires at least one function/)
  })

  it('Can pipe one method', () => {
    const result = pipe(testFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle')
  })

  it('Can pipe two methods', () => {
    const result = pipe(testFunc1, testFunc2)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle the cow jumped over the moon')
  })

  it('Can pipe two methods with autoMerge on', () => {
    const result = pipe(testMergeFunc1, testMergeFunc2)({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon'
    )
    expect(Object.keys(result).length).to.equal(1)
  })

  it('Can pipe two methods with autoMerge off', () => {
    const result = pipe(
      { autoMerge: false },
      testMergeFunc1,
      testMergeFunc2
    )({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal('undefined the cat and the fiddle the cow jumped over the moon')
  })

  it('Gives a time for piping sync', () => {
    const iterations = 10000
    let result
    const startTime = performance.now()
    for (let i = 0; i < iterations; i++) {
      result = pipe(testFunc1, testFunc2)('hey diddle diddle')
    }
    const elapsed = performance.now() - startTime
    console.log(`Performance of sync with ${iterations} iterations: ${elapsed}`)
    expect(result).to.exist
    console.log(result)
  })

  it('Gives a time for piping async on sync methods', async () => {
    const iterations = 10000
    let result
    const startTime = performance.now()
    for (let i = 0; i < iterations; i++) {
      result = await pipeAsync(testFunc1, testFunc2)('hey diddle diddle')
    }
    const elapsed = performance.now() - startTime
    console.log(`Performance of async on sync methods with ${iterations} iterations: ${elapsed}`)
    expect(result).to.exist
    console.log(result)
  })
})
