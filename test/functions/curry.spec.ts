import { expect } from 'chai'
import { curry } from '../../src'
import { getType } from '../test-helpers/type-helper'

const greet = (salutation, title, firstName, lastName) =>
  salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!'

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

  it('should create partial function', () => {
    const canPassAnyNumberOfArguments = curry(greet, 'Hello', 'Ms.')
    const fn = canPassAnyNumberOfArguments('foo')

    expect(getType(fn)).to.equal('Function')

    expect(fn('bar')).to.equal('Hello, Ms. foo bar!')
  })

  it('should ignore extra arguments', () => {
    const canPassAnyNumberOfArguments = curry(greet, 'Hello', 'Ms.')
    const fn = canPassAnyNumberOfArguments('foo')

    expect(getType(fn)).to.equal('Function')

    expect(fn('bar', 1, 2)).to.equal('Hello, Ms. foo bar!')
  })

  it('should work when array is input', () => {
    const fooFn = (a, b, c, d) => ({ a, b, c, d })
    const barFn = curry(fooFn, [1, 2], [])

    expect(barFn(1, 2)).to.deep.equal({ a: [1, 2], b: [], c: 1, d: 2 })
  })

  it('should meet ramda spec', () => {
    const sayHello = curry(greet, 'Hello')
    const sayHelloToMs = curry(sayHello, 'Ms.')

    expect(sayHelloToMs('Jane', 'Jones')).to.equal('Hello, Ms. Jane Jones!')
  })
})
