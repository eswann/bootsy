import { expect } from 'chai'
import { compose } from '../../src'

const testFunc1 = (rootText) => {
  return `${rootText} the cat and the fiddle`
}

const testFunc2 = (rootText) => {
  return `${rootText} the cow jumped over the moon`
}

describe('compose', () => {
  it('Throws if no functions are passed', () => {
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
})
