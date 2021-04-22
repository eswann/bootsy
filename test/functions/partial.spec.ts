import { expect } from 'chai'
import { getType } from '../test-helpers/type-helper'
import { partial } from '../../src'

const greet = (salutation, title, firstName, lastName) =>
  salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!'

describe('partial', () => {
  it('should create partial function', () => {
    const canPassAnyNumberOfArguments = partial(greet, 'Hello', 'Ms.')
    const fn = canPassAnyNumberOfArguments('foo')

    expect(getType(fn)).to.equal('Function')

    expect(fn('bar')).to.equal('Hello, Ms. foo bar!')
  })

  it('should ignore extra arguments', () => {
    const canPassAnyNumberOfArguments = partial(greet, 'Hello', 'Ms.')
    const fn = canPassAnyNumberOfArguments('foo')

    expect(getType(fn)).to.equal('Function')

    expect(fn('bar', 1, 2)).to.equal('Hello, Ms. foo bar!')
  })

  it('should work when array is input', () => {
    const fooFn = (a, b, c, d) => ({
      a,
      b,
      c,
      d,
    })
    const barFn = partial(fooFn, [1, 2], [])

    expect(barFn(1, 2)).to.deep.equal({
      a: [1, 2],
      b: [],
      c: 1,
      d: 2,
    })
  })

  it('should meet ramda spec', () => {
    const sayHello = partial(greet, 'Hello')
    const sayHelloToMs = partial(sayHello, 'Ms.')

    expect(sayHelloToMs('Jane', 'Jones')).to.equal('Hello, Ms. Jane Jones!')
  })
})
