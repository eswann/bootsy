# Bootsy

<img src="https://lastfm.freetls.fastly.net/i/u/ar0/cedc846292324665b46d380e72b16469.jpg"></img>

Funky fresh (and easy) functional-lite!

###Why?
Bootsy was created to make functional composition as easy as possible. Sure there are Ramda, Lodash, and others,
but the idea behind Bootsy was to make everyday functional tasks easier, and provide additional features
that we've found helpful in enterprise production apps.

##Features
...that set us apart
* Typescript gives us excellent intellisense and type checking
* Async pipe/composition
* Built-in logging
* Built-in timing for each piped function
* Auto-merge of input and output arguments

###Typescript
Typescript gives us great editor support!


###Async Support
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
  return `${rootText} the cow jumped over the moon`
}
// Pipe it!!!
const pipedResult = await pipeAsync(testAsyncFunc1, testAsyncFunc2)('We got tha funk!')
// Compose it!!!
const composedResult = await composeAsync(testAsyncFunc2, testAsyncFunc1)('funk tha got We!')
```

###Built-in Logging
By default, Bootsy always logs any errors encountered while running each function (and then rethrows the error).
Bootsy will log each function call with timings at the **debug** level.
Logging is set to the info level by default, but this can be adjusted using the configuration setup
at a global or function level, and you can provide the logger of your choice! The default is the console.

#####Options (including logging) can be set up globally
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

#####Options (including logging) can be set up per composed functions call (pipe/compose/etc...)
```javascript
// Alternately any call to one of our composition functions can accept options as the fir
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
const pipedResult = await pipeAsync(options,  testAsyncFunc1, testAsyncFunc2)('We got da funk!')
```

