import { expect } from 'chai'
import { curry } from '../../src'

describe('curry', () => {
  it('should curry a function', () => {
    const addFourNumbers = (a, b, c, d) => a + b + c + d
    const curriedAddFourNumbers = curry(addFourNumbers)
    const f = curriedAddFourNumbers(1, 2)
    const g = f(3)

    expect(g(4)).to.equal(10)
  })

  it('should work when called with more arguments', () => {
    const add = curry((n, n2) => n + n2)
    expect(add(1, 2, 3)).to.equal(3)
  })

  it('should work when called with zero arguments', () => {
    const sub = curry((a, b) => a - b)
    const s0 = sub()

    expect(s0(5, 2)).to.equal(3)
  })

  it('should work when called via multiple curry stages', () => {
    const join = curry((a, b, c, d) => [a, b, c, d].join('-'))

    const stage1 = join('A')
    const stage2 = stage1('B', 'C')

    expect(stage2('D')).to.equal('A-B-C-D')
  })
})
