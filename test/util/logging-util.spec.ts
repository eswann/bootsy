import { expect } from 'chai'
import delay from 'delay'
import { Config, LogLevel } from '../../src'
import { logDuration, logFunctionStart } from '../../src/util/logging-util'
const sinon = require('sinon').createSandbox()

function testFunc(arg1, arg2) {
  return arg1 + arg2
}

afterEach(function () {
  sinon.restore()
})

describe('Logging Util', () => {
  it('should return a log duration', async function () {
    Config.initialize({ logLevel: LogLevel.debug })
    const loggerSpy = sinon.spy(console, 'debug')

    const startTime = logFunctionStart(Config.executeOptions, testFunc, ['testArg1', 'testArg2'])
    await delay(11)
    const duration = logDuration(Config.executeOptions, testFunc, startTime)

    expect(duration).to.be.greaterThan(10)
    expect(loggerSpy.calledTwice).to.be.true
    expect(loggerSpy.firstCall.firstArg).to.equal('Calling function testFunc with args')
    expect(loggerSpy.firstCall.lastArg).to.deep.equal({ 0: 'testArg1', 1: 'testArg2' })
    expect(loggerSpy.secondCall.firstArg).to.include('Stopwatch - Function: testFunc, Duration:')
  })

  it('should not return a log duration if not debug', async function () {
    Config.initialize({ logLevel: LogLevel.info })
    const loggerSpy = sinon.spy(console, 'debug')

    const startTime = logFunctionStart(Config.executeOptions, testFunc, ['testArg1', 'testArg2'])
    await delay(10)
    const duration = logDuration(Config.executeOptions, testFunc, startTime)

    expect(startTime).to.be.undefined
    expect(duration).to.be.undefined
    expect(loggerSpy.notCalled).to.be.true
  })
})
