const sinon = require('sinon').createSandbox()
const chai = require('chai')
const { expect } = chai
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const delay = require('delay')
const { pipeAsync } = require('../dist')

const tryEmptyPipe = async () => {
  try {
    await pipeAsync()('barf')
  } catch (err) {
    return err
  }
}

const testAsyncFunc1 = async (rootText) => {
  await delay(50)
  return `${rootText} the cat and the fiddle`
}

const testErrorFunc1 = async () => {
  await delay(20)
  throw new Error('ouch')
}

const testAsyncFunc2 = async (rootText) => {
  await delay(30)
  return `${rootText} the cow jumped over the moon`
}

const testSyncFunc1 = (rootText) => {
  return `${rootText} the little dog laughed`
}

describe('pipeAsync', () => {
  afterEach(function () {
    sinon.restore()
  })

  it('Throws if no functions are passed', async () => {
    const error = await tryEmptyPipe()
    expect(error.message.includes('requires at least one function')).to.be.true
    expect(error).to.exist
  })

  it('Can pipe one async method', async () => {
    const result = await pipeAsync(testAsyncFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle')
  })

  it('Error is logged when pipe async is called', async () => {
    const loggerSpy = sinon.spy(console, 'error')
    await expect(pipeAsync(testErrorFunc1)()).to.be.rejected
    expect(loggerSpy.calledOnce).to.be.true
  })

  it('Can pipe two async methods', async () => {
    const result = await pipeAsync(testAsyncFunc1, testAsyncFunc2)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle the cow jumped over the moon')
  })

  it('Can mix in sync methods', async () => {
    const result = await pipeAsync(
      testAsyncFunc1,
      testAsyncFunc2,
      testSyncFunc1
    )('hey diddle diddle')
    expect(result).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon the little dog laughed'
    )
  })
})
