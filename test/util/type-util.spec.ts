import { expect } from 'chai'
import { isPlainObject, isFunction, isAsync, isString } from '../../src/util/type-util'

describe('Type Util', function () {
  describe('isFunction', () => {
    it('should return true with function', () => {
      const fn1 = () => {}
      const fn2 = function () {}
      function fn3() {}
      async function fn4() {
        return Promise.resolve('test')
      }

      const funcs = [() => {}, fn1, fn2, fn3, fn4]
      funcs.map((val) => {
        expect(isFunction(val)).to.be.true
      })
    })

    it('should return false with other types', () => {
      expect(isFunction(true)).to.be.false
      expect(isFunction(500)).to.be.false
      expect(isFunction({ test: 'test' })).to.be.false
    })
  })

  describe('isAsync', () => {
    it('should return true with async functions', () => {
      const fn1 = async () => Promise.resolve('test')
      async function fn2() {
        return Promise.resolve('test')
      }

      const funcs = [fn1, fn2]
      funcs.map((val) => {
        expect(isAsync(val)).to.be.true
      })
    })

    it('should return false with other types', () => {
      const fn1 = () => 'test'
      function fn2() {
        return 'test'
      }

      const funcs = [fn1, fn2]
      funcs.map((val) => {
        expect(isAsync(val)).to.be.false
      })
    })
  })

  describe('isString', () => {
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

  describe('isPlainObject', () => {
    it('should return true with plain object', () => {
      expect(isPlainObject({ test: 'test' })).to.be.true
      expect(isPlainObject(new Object({}))).to.be.true
    })

    it('should return false with other types', () => {
      class testClass {
        testProp: String
      }
      const fn1 = () => 'test'
      expect(isPlainObject(new testClass())).to.be.false
      expect(isPlainObject('hello')).to.be.false
      expect(isPlainObject(fn1())).to.be.false
    })
  })
})
