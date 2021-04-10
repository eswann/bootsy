import * as runner from '../../src/util/runner'
import { Config, LogLevel } from '../../src'

import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
const { expect } = chai
chai.use(chaiAsPromised)

const sinon = require('sinon').createSandbox()
describe('runner', () => {
  afterEach(function () {
    Config.initialize({ logLevel: LogLevel.info })
    sinon.restore()
  })

  describe('ExecuteAsync', function () {
    it('Should call logger on executeAsync', async () => {
      const loggerSpy = sinon.spy(console, 'error')
      const testFunction = () => {
        throw new Error('test error')
      }

      expect(runner.executeAsync(Config.executeOptions, testFunction)).to.be.rejected
      expect(loggerSpy.calledOnce).to.be.true
    })

    it('Should call stopwatch if log level debug on executeAsync', async () => {
      const loggerSpy = sinon.spy(console, 'debug')
      Config.initialize({ logLevel: LogLevel.debug })

      const testObject = {
        testFunction: (arg) => arg,
      }

      const result = await runner.executeAsync(
        Config.executeOptions,
        testObject.testFunction,
        'foo'
      )
      expect(result).to.equal('foo')

      expect(loggerSpy.calledTwice).to.be.true
      expect(loggerSpy.secondCall.firstArg).to.include('Stopwatch')
    })
  })

  describe('Execute', function () {
    it('Allows the logger to be set on sync', () => {
      const loggerSpy = sinon.spy(console, 'error')

      const testFunction = () => {
        throw new Error('test error')
      }

      let error
      try {
        runner.execute(Config.executeOptions, testFunction)
      } catch (err) {
        error = err
      }

      expect(error).to.exist
      expect(loggerSpy.calledOnce).to.be.true
    })

    it('Calls the stopwatch if in debug mode on sync', () => {
      const loggerSpy = sinon.spy(console, 'debug')
      Config.initialize({ logLevel: LogLevel.debug })

      const testObject = {
        testFunction: (arg) => arg,
      }

      const result = runner.execute(Config.executeOptions, testObject.testFunction, 'foo')
      expect(result).to.equal('foo')

      expect(loggerSpy.calledTwice).to.be.true
      expect(loggerSpy.secondCall.firstArg).to.include('Stopwatch')
    })
  })

  describe('ParseFunctionsAndOptions', function () {
    it('Throws on empty function array', () => {
      expect(() => runner.parseFunctionsAndOptions('test', [])).to.throw
    })

    it('Throws if only options provided', () => {
      const options = {
        autoMerge: true,
        logLevel: LogLevel.debug,
      }

      expect(() => runner.parseFunctionsAndOptions('test', [options])).to.throw(
        'test requires at least one function'
      )
    })

    it('Succeeds with options and functions', () => {
      const options = {
        autoMerge: false,
        logLevel: LogLevel.debug,
      }
      const testFunction = () => {}
      const result = runner.parseFunctionsAndOptions('test', [options, testFunction])

      expect(result.options.logLevel).to.equal(LogLevel.debug)
      expect(result.options.autoMerge).to.equal(false)
      expect(result.execFns[0]).to.equal(testFunction)
    })
  })

  describe('ValidateFunction', function () {
    it('Should err if not function', () => {
      // @ts-ignore
      expect(() => runner.validateFunction('test')).to.throw
    })

    it('Should not err if function', () => {
      // @ts-ignore
      expect(() => runner.validateFunction(() => {})).to.not.throw
    })
  })
})
