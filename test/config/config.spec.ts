import { expect } from 'chai'
import { Config, LogLevel } from '../../src'

describe('config', () => {
  it('should initialize with LogLevel', () => {
    Config.initialize({ logLevel: LogLevel.debug })
    expect(Config.executeOptions.logLevel).to.equal(LogLevel.debug)
  })

  it('should initialize with string', () => {
    Config.initialize({ logLevel: 'debug' })
    expect(Config.executeOptions.logLevel).to.equal(LogLevel.debug)
  })

  it('should throw with bad string', () => {
    expect(() => Config.initialize({ logLevel: 'foo' })).to.throw(
      'Lambduh log level is not valid: foo'
    )
  })

  it('should initialize with number', () => {
    Config.initialize({ logLevel: 5 })
    expect(Config.executeOptions.logLevel).to.equal(LogLevel.debug)
  })

  it('should throw with bad number', () => {
    expect(() => Config.initialize({ logLevel: 1000 })).to.throw
  })

  it('should initialize with console logger if none provided', () => {
    Config.initialize({ logLevel: LogLevel.debug })
    expect(Config.executeOptions.logger).to.equal(console)
  })

  it('should initialize with specific logger if provided', () => {
    const myLogger = {
      trace: function (message, optionalParams) {},
      debug: function (message, optionalParams) {},
      info: function (message, optionalParams) {},
      warn: function (message, optionalParams) {},
      error: function (message, optionalParams) {},
    }

    Config.initialize({ logLevel: LogLevel.debug, logger: myLogger })
    expect(Config.executeOptions.logger).to.equal(myLogger)
  })

  it('should initialize with autoMerge', () => {
    Config.initialize({ autoMerge: false, logLevel: LogLevel.debug })
    expect(Config.executeOptions.autoMerge).to.equal(false)
  })

  it('should initialize with autoMerge true by default', () => {
    Config.reset()
    Config.initialize({})
    expect(Config.executeOptions.autoMerge).to.equal(true)
  })
})
