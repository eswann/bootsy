const { expect } = require('chai')
const { Config, LogLevel } = require('../../dist/config')

describe('config', () => {
  it('should initialize with LogLevel', () => {
    Config.initialize(LogLevel.debug)
    expect(Config.logLevel).to.equal(LogLevel.debug)
  })

  it('should initialize with string', () => {
    Config.initialize('debug')
    expect(Config.logLevel).to.equal(LogLevel.debug)
  })

  it('should throw with bad string', () => {
    expect(() => Config.initialize('foo')).to.throw('Lambduh log level is not valid: foo')
  })

  it('should initialize with number', () => {
    Config.initialize(5)
    expect(Config.logLevel).to.equal(LogLevel.debug)
  })

  it('should throw with bad number', () => {
    expect(() => Config.initialize(1000)).to.throw
  })

  it('should initialize with console logger if none provided', () => {
    Config.initialize(LogLevel.debug)
    expect(Config.logger).to.equal(console)
  })

  it('should initialize with specific logger if provided', () => {
    const myLogger = {}
    Config.initialize(LogLevel.debug, myLogger)
    expect(Config.logger).to.equal(myLogger)
  })
})
0
