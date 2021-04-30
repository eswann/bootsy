import delay from 'delay'
import { expect } from 'chai'
import { composeAsync } from '../../src'

const tryEmptyCompose = async () => {
  try {
    // @ts-ignore
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

const testMergeFunc1 = async ({ text1 }) => {
  await delay(10)
  return { text2: 'the cat and the fiddle' }
}

const testMergeFunc2 = async ({ text1, text2 }) => {
  await delay(20)
  const text3 = 'the cow jumped over the moon'
  return { text: `${text1} ${text2} ${text3}` }
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

  it('Can compose two methods with autoMerge on', async () => {
    const result = await composeAsync(
      testMergeFunc2,
      testMergeFunc1
    )({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal(
      'hey diddle diddle the cat and the fiddle the cow jumped over the moon'
    )
    expect(Object.keys(result).length).to.equal(1)
  })

  it('Can compose two methods with autoMerge off', async () => {
    const result = await composeAsync(
      { autoMerge: false },
      testMergeFunc2,
      testMergeFunc1
    )({ text1: 'hey diddle diddle' })
    expect(result.text).to.equal('undefined the cat and the fiddle the cow jumped over the moon')
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
