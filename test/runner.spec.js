const { Config, LogLevel } = require('../dist')
const chai = require('chai')
const { expect } = chai
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const sinon = require('sinon').createSandbox()
const runner = require('../dist/util/runner')

describe('runner', () => {
  afterEach(function () {
    Config.initialize(LogLevel.info)
    sinon.restore()
  })

  it('Should call logger on executeAsync', async () => {
    const loggerSpy = sinon.spy(console, 'error')
    const testFunction = () => {
      throw new Error('test error')
    }

    expect(runner.executeAsync(testFunction)).to.be.rejected
    expect(loggerSpy.calledOnce).to.be.true
  })

  it('Should call stopwatch if log level debug on executeAsync', async () => {
    const loggerSpy = sinon.spy(console, 'debug')
    Config.initialize(LogLevel.debug)

    const testObject = {
      testFunction: (arg) => arg,
    }

    const result = await runner.executeAsync(testObject.testFunction, 'foo')
    expect(result).to.equal('foo')

    expect(loggerSpy.calledTwice).to.be.true
    expect(loggerSpy.secondCall.firstArg).to.include('Stopwatch')
  })

  it('Allows the logger to be set on sync', () => {
    const loggerSpy = sinon.spy(console, 'error')

    const testFunction = () => {
      throw new Error('test error')
    }

    let error
    try {
      runner.execute(testFunction)
    } catch (err) {
      error = err
    }

    expect(error).to.exist
    expect(loggerSpy.calledOnce).to.be.true
  })

  it('Calls the stopwatch if in debug mode on sync', () => {
    const loggerSpy = sinon.spy(console, 'debug')
    Config.initialize(LogLevel.debug)

    const testObject = {
      testFunction: (arg) => arg,
    }

    const result = runner.execute(testObject.testFunction, 'foo')
    expect(result).to.equal('foo')

    expect(loggerSpy.calledTwice).to.be.true
    expect(loggerSpy.secondCall.firstArg).to.include('Stopwatch')
  })
})
