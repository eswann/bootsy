import { expect } from 'chai'
import delay from 'delay'
import { overAsync } from '../../src'

const testAsyncFunc1 = async ({ cat }) => {
  await delay(50)
  return `One ${cat}`
}

const testAsyncFunc2 = async ({ cat }) => {
  await delay(20)
  return `Two ${cat}`
}

const testAsyncFunc3 = async ({ cat }) => {
  await delay(30)
  return `Three ${cat}`
}

describe('overAsync', () => {
  it('creates a function that invokes iteratees with the arguments it receives and returns their results.', async () => {
    const response = await overAsync(testAsyncFunc1, testAsyncFunc2, testAsyncFunc3)({ cat: 'cat' })
    expect(response).to.deep.equal(['One cat', 'Two cat', 'Three cat'])
  })
})
