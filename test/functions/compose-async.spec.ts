import delay from 'delay'
import { expect } from 'chai'
import { composeAsync } from '../../src'

const tryEmptyCompose = async () => {
  try {
    await composeAsync()('barf')
  } catch (err) {
    return err
  }
}

const testAsyncFunc1 = async (rootText) => {
  await delay(50)
  return `${rootText} the cat and the fiddle`
}

const testAsyncFunc2 = async (rootText) => {
  await delay(30)
  return `${rootText} the cow jumped over the moon`
}

const testSyncFunc1 = (rootText) => {
  return `${rootText} the little dog laughed`
}

describe('composeAsync', () => {
  it('Throws if no functions are passed', async () => {
    const error = await tryEmptyCompose()
    expect(error).to.exist
    expect(error.message.includes('requires at least one function')).to.equal(true)
  })

  it('Can compose one async method', async () => {
    const result = await composeAsync(testAsyncFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle')
  })

  it('Can compose two async methods', async () => {
    const result = await composeAsync(testAsyncFunc2, testAsyncFunc1)('hey diddle diddle')
    expect(result).to.equal('hey diddle diddle the cat and the fiddle the cow jumped over the moon')
  })

  it('Can mix in sync methods', async () => {
    const result = await composeAsync(
      testSyncFunc1,
      testAsyncFunc2,
      testAsyncFunc1
    )('hey diddle diddle')
    expect(result).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon the little dog laughed'
    )
  })
})
