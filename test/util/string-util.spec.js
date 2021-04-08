const { expect } = require('chai')
const { isString } = require('../../dist/util/string-util')

describe('String Util', () => {
  it('should return true with string', () => {
    expect(isString('testString')).to.be.true
  })

  it('should return true with string object', () => {
    expect(isString(String('testString'))).to.be.true
  })

  it('should return false with other types', () => {
    expect(isString(true)).to.be.false
    expect(isString(500)).to.be.false
    expect(isString({ test: 'test' })).to.be.false
  })
})
