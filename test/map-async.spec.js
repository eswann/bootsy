const chai = require('chai')
const { expect } = chai
const sinon = require('sinon').createSandbox()
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)

const delay = require('delay')
const { mapAsync } = require('../dist')

const makeYourOwnRhyme = async (verse) => {
  await delay(50)
  return `${verse} the cat and the fiddle`
}

const testErrorFunc1 = async () => {
  await delay(20)
  throw new Error('ouch')
}

describe('all-funcs', () => {
  afterEach(function () {
    sinon.restore()
  })

  it('Throws if no function is passed', async () => {
    expect(() => mapAsync(null, ['hey', 'howdy'])).to.throw()
  })

  it('Throws if array is not passed', async () => {
    expect(() => mapAsync(makeYourOwnRhyme, 'hey')).to.throw()
  })

  it('Resolves to empty result if null is passed', async () => {
    const results = await mapAsync(makeYourOwnRhyme, null)
    await expect(results).to.have.length(0)
  })

  it('Resolves to empty result if empty array is passed', async () => {
    const results = await mapAsync(makeYourOwnRhyme, null)
    await expect(results).to.have.length(0)
  })

  it('Error is logged when map async is called', async () => {
    const loggerSpy = sinon.spy(console, 'error')
    await expect(mapAsync(testErrorFunc1, ['test', 'test'])).to.be.rejected
    expect(loggerSpy.called).to.be.true
  })

  it('should execute with multiple args', async () => {
    const [result1, result2, result3] = await mapAsync(makeYourOwnRhyme, [
      'skittle',
      'diddle',
      'middle',
    ])
    expect(result1).to.equal('skittle the cat and the fiddle')
    expect(result2).to.equal('diddle the cat and the fiddle')
    expect(result3).to.equal('middle the cat and the fiddle')
  })
})
