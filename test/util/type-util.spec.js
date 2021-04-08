const { expect } = require('chai')
const { getType } = require('../../dist/util/type-util')

describe('Type Util', () => {
  it('should work with simple promise', () => {
    expect(getType(Promise.resolve(1))).to.equal('Promise')
  })

  it('should work with new Boolean', () => {
    expect(getType(Boolean(true))).to.equal('Boolean')
  })

  it('should work with new String', () => {
    expect(getType(String('I am a String object'))).to.equal('String')
  })

  it('should work with new Number', () => {
    expect(getType(Number(1))).to.equal('Number')
  })

  it('should work with new promise', () => {
    const delay = (ms) =>
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(ms + 110)
        }, ms)
      })

    expect(getType(delay(10))).to.equal('Promise')
  })

  it('should work with async function', () => {
    expect(getType(async () => {})).to.equal('Async')
  })

  it('should work with async arrow', () => {
    const asyncArrow = async () => {}
    expect(getType(asyncArrow)).to.equal('Async')
  })

  it('should work with function', () => {
    const fn1 = () => {}
    const fn2 = function () {}

    function fn3() {}

    const funcs = [() => {}, fn1, fn2, fn3]
    funcs.map((val) => {
      expect(getType(val)).to.equal('Function')
    })
  })

  it('should work with object', () => {
    expect(getType({})).to.equal('Object')
  })

  it('should work with number', () => {
    expect(getType(1)).to.equal('Number')
  })

  it('should work with boolean', () => {
    expect(getType(false)).to.equal('Boolean')
  })

  it('should work with string', () => {
    expect(getType('foo')).to.equal('String')
  })

  it('should work with null', () => {
    expect(getType(null)).to.equal('Null')
  })

  it('should work with array', () => {
    expect(getType([])).to.equal('Array')
    expect(getType([1, 2, 3])).to.equal('Array')
  })

  it('should work with regex', () => {
    expect(getType(/\s/g)).to.equal('RegExp')
  })

  it('should work with undefined', () => {
    expect(getType(undefined)).to.equal('Undefined')
  })

  it('should work with not a number', () => {
    expect(getType(Number('s'))).to.equal('NaN')
  })
})
