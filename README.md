# tent-discover
A node.js implementation of the [Tent](https://tent.io) discovery dance.

## install
With npm:
```
npm install tent-discover
```

## example
```
var discover = require('tent-discover')
var entity = 'https://example.com'

discover(entity, function(err, profile) {
    if(err) return console.log(err)
    console.log(profile)
})
```

## methods

```
var discover = require('tent-discover')
```

### discover(entity, function(err, profile) {})
The first argument `entity` needs to be a full entity url (with http:// / https://).
The callback will be triggerd with an `err` object for potential errors and hopefully a `profile` object, which contains the raw JSON as returned from the server. 

## todo
- implement html scraping for link tags described [here](https://tent.io/docs/server-protocol#html-codelinkcode-tag)

## license
MIT