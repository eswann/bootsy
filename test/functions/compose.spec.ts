import { expect } from 'chai'
import { compose } from '../../src'

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

describe('compose', () => {
  it('Throws if no functions are passed', () => {
    // @ts-ignore
    expect(() => compose()).to.throw(/requires at least one function/)
  })

  it('Can compose one method', () => {
    const result = compose(testFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle')
  })

  it('Can compose two methods', () => {
    const result = compose(testFunc2, testFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle the cow jumped over the moon')
  })

  it('Can compose two methods with autoMerge on', () => {
    const result = compose(testMergeFunc2, testMergeFunc1)({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon'
    )
    expect(Object.keys(result).length).to.equal(1)
  })

  it('Can compose two methods with autoMerge off', () => {
    const result = compose(
      { autoMerge: false },
      testMergeFunc2,
      testMergeFunc1
    )({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal('undefined the cat and the fiddle the cow jumped over the moon')
  })
})
