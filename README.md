# Bootsy

<img src="https://lastfm.freetls.fastly.net/i/u/ar0/cedc846292324665b46d380e72b16469.jpg"></img>

Funky fresh (and easy) functional-lite!

### Why?
Bootsy was created to make functional composition as pragmatic as possible. Sure there's Ramda, Lodash, and others,
but the idea behind Bootsy was to make everyday functional tasks easier, and provide additional features
that we've found helpful in enterprise production apps.

In addition, side effects are discouraged in pure functional programming, but in the real world of enterprise development,
side effects are necessary to perform async operations such as saving data etc...
We encourage piping and composition as a way to organize code, even code that necessarily has side effects.

## Features
...that set us apart
* Typescript gives us excellent intellisense and type checking
* Async pipe/composition
* Built-in logging
* Built-in timing for each piped function
* Auto-merge of input and output arguments

### Typescript
Typescript combined with JSDoc gives us great editor support!
<img src="https://github.com/eswann/bootsy/blob/main/readme-assets/editor-support-1.png?raw=true"></img>

### Async Support
For pragmatic functional-lite, the ability to pipe async methods is essential, for this reason we
support pipeAsync and composeAsync

```javascript
const testAsyncFunc1 = async (myArg) => {
  const result1 = await myAsyncFunc(myArg)
  const result2 = await myAsyncFunc2(result1)
  return result2
}
const testAsyncFunc2 = async (myArg) => {
  const result3 = await myAsyncFunc3(myArg)
  return `${rootText} One nation under a groove`
}
// Pipe it!!!
const pipedResult = await pipeAsync(testAsyncFunc1, testAsyncFunc2)('Give up the funk!')
// Compose it!!!
const composedResult = await composeAsync(testAsyncFunc2, testAsyncFunc1)('funk the up Give!')
```

### Built-in Logging and Timings
By default, Bootsy always logs errors encountered while running each function (and then rethrows the error).
Logging is set to the info level by default, but this can be adjusted using configuration setup
at a global or function level, and you can provide your logger of choice! The default is the console.

Bootsy will log each function call with timings at the **debug** level or by explicitly setting the **logTimings**
flag in the configuration options.

##### Options (including logging) can be set up globally
```javascript
const myCustomLogger = {
  trace: function (message, optionalParams) {},
  debug: function (message, optionalParams) {},
  info: function (message, optionalParams) {},
  warn: function (message, optionalParams) {},
  error: function (message, optionalParams) {},
}
// Global logging setup, both arguments are optional
Config.initialize({logLevel: Loglevel.debug, logger: myCustomLogger})
```

##### Options (including logging) can be set up per composed functions call (pipe/compose/etc...)
The first argument of one of our pipe/compose calls can be options to override global options. The provided
options will be merged into the global options for the specific call only.
```javascript
// Alternately any call to one of our composition functions can accept options as the first argument
const myCustomLogger = {
  trace: function (message, optionalParams) {},
  debug: function (message, optionalParams) {},
  info: function (message, optionalParams) {},
  warn: function (message, optionalParams) {},
  error: function (message, optionalParams) {},
}
const options = {
  logLevel: Loglevel.error,
  logger: myCustomLogger
}
// Pipe with explicit options provided
const pipedResult = await pipeAsync(options,  testAsyncFunc1, testAsyncFunc2)('Give up the funk!')
```

##### Turn on timings explicitly
The first argument of one of our pipe/compose calls can be options to override global options. The provided
options will be merged into the global options for the specific call only.
```javascript
// Global setup of logging timings
Config.initialize({logTimings:true})
// Or pass them into any pipe/compose/etc...
const options = {
  logTimings: true
}
// Pipe with explicit options provided
const pipedResult = await pipeAsync(options,  testAsyncFunc1, testAsyncFunc2)('Bootzilla')
```

### Auto-merge
So what is auto-merge? It's actually my favorite features of this library, but it's a little hard to explain.
In JavaScript, it's very common to pass all function parameters in a single object argument, as in the example below.
Notice that text1 and text2 below are actually properties of one argument, not separate arguments. This pattern is
well-supported by editors/JSDoc etc...
The following article explains why we would want to follow this pattern in JavaScript:
https://levelup.gitconnected.com/always-pass-one-argument-to-your-javascript-function-4140d909937e

```javascript
const someFunc = ({ text1, text2 }) => {
  const text3 = 'random text to append'
  return { text: `${text1} ${text2} ${text3}` }
}
```

When piping functions like these, we often find ourselves passing arguments through functions that aren't even used,
so that they can be conveyed to another function further down the pipe. Yes there are ways around this, but our goal is
to make piping functions both clean and easy.
```javascript
const func1 = ({ text1, text2 }) => {
  const text3 = text1 + text2
  return {text1, text3}
}
// ---> *** The problem ***
// This function do anything with text3, but func3 needs it!
// So I have to pass it through, but this is just bad in so many ways!!!
const func2 = ({text1, text3}) => {
  const text4 = doSomthing(text1)
  return {text3, text4}
}
const func3 = ({text3, text4}) => {
  const text5 = doAnotherThing(text3, text4)
  return text5
}
const pipedResult = await pipe(func1,  func2,  func3)({text1: 'Aqua', text2: 'Boogie'})
```

With auto-merge, which is enabled by default, you don't have to do this.
Each function can focus on its responsibilities only.
```javascript
const func1 = ({ text1, text2 }) => {
  const text3 = text1 + text2
  return {text1, text3}
}
// I no longer have to pass text3 through
const func2 = ({text1}) => {
  const text4 = doSomthing(text1)
  return {text4}
}
// Automerge makes sure that text3 is supplied to func3
const func3 = ({text3, text4}) => {
  const text5 = doAnotherThing(text3, text4)
  return text5
}
const pipedResult = await pipe(func1,  func2,  func3)({text1: 'Soul', text2: 'Power'})
```

#### Configuring Auto-merge
```javascript
// Global setup of logging timings
Config.initialize({autoMerge: false})
// Or pass them into any pipe/compose/etc...
const options = {
  autoMerge: false
}
// Pipe with explicit options provided
const pipedResult = await pipeAsync(options,  func1, func2)({text1: 'Super', text2: 'Bad'})
```

### Other Functions
The following functions are included to help with functionality needed in common functional scenarios, but combine us
with any functional library out there! We play just fine with Ramda, Lodash, etc...

#### Curry
Creates a curried function from a "regular" function. Curried functions return a new function until all expected
arguments are provided. In our case, "curry" and "partial" are the same, meaning curry can also accept initial parameters
as part of the call to curry.
```javascript
  const addFourNumbers = (a, b, c, d) => a + b + c + d
  // Create a curried version of any function, include some arguments or none
  const curriedFunction = curry(addFourNumbers, 1)
  // Calling is with some additional arguments returns a new partially fulfilled function
  const partiallyFulfilledCurriedFunction = curriedFunction(2, 3)
  // Calling it at any time with the remaining arguments causes the function to evaluate
  const result = partiallyFulfilledCurriedFunction(4)
```

#### Curry Merge
Works like curry, but in the case where a single object argument is provided.
```javascript
  const addThreeNumbers = ({ a, b, c }) => a + b + c
  // CurryMerge with one parameter provided will return a partially fulfilled function
  const curriedFunction = curryMerge(addThreeNumbers, { a: 1 })
  // Calling it at any time with the remaining arguments causes the function to evaluate
  const result = curriedFunction({b:2, c:3})
```

#### Map Async
This is like the standard JavaScript map, but async, and with our top level logging, timing, etc...
Map Async applies every argument provided to a single function independently and returns an awaited array of results:
One result for each evaluation of the function.
```javascript
  const [result1, result2, result3] = await mapAsync(makeYourOwnRhyme, ['skittle', 'diddle', 'fiddle'])
```

#### Over Async
Over Async can be though of as the inverse of Map Async.
Over Async applies the same args to an array of functions and awaits all of them, returning an array of results.
```javascript
  const [result1, result2, result3] = await overAsync(testAsyncFunc1, testAsyncFunc2, testAsyncFunc3)('Bootsy', 'Catfish')
```
