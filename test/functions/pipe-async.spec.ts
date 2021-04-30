import chaiAsPromised from 'chai-as-promised'
import chai from 'chai'
import delay from 'delay'
import { pipeAsync } from '../../src'

const sinon = require('sinon').createSandbox()
const { expect } = chai
chai.use(chaiAsPromised)
const tryEmptyPipe = async () => {
  try {
    // @ts-ignore
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

const testMergeFunc1 = async ({ text1 }) => {
  await delay(10)
  return { text2: 'the cat and the fiddle' }
}

const testMergeFunc2 = async ({ text1, text2 }) => {
  await delay(20)
  const text3 = 'the cow jumped over the moon'
  return { text: `${text1} ${text2} ${text3}` }
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

  it('Can pipe two methods with autoMerge on', async () => {
    const result = await pipeAsync(testMergeFunc1, testMergeFunc2)({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon'
    )
    expect(Object.keys(result).length).to.equal(1)
  })

  it('Can pipe two methods with autoMerge off', async () => {
    const result = await pipeAsync(
      { autoMerge: false },
      testMergeFunc1,
      testMergeFunc2
    )({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal('undefined the cat and the fiddle the cow jumped over the moon')
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
