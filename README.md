# tent-discover
Simple node.js module which performes the [Tent](https://tent.io) discovery dance. Supports the current version 0.3.
[![Build Status](https://travis-ci.org/hendrikcech/tent-discover.png?branch=master)](https://travis-ci.org/hendrikcech/tent-discover)

## install
With npm:

    npm install tent-discover

## example

    var discover = require('tent-discover')
    var entity = 'https://example.com'

    discover(entity, function(err, meta) {
        if(err) return console.error(err)
        console.log(meta)
    })

[example](example/example.js)

## methods

    var discover = require('tent-discover')

### discover(entity, function callback(error, meta, response) {})
Very simple: This function takes the entity to discover and invokes the callback when done. If successful, `meta` should contain the meta post, defined [here](https://tent.io/docs/post-types#meta). `response` contains the raw [http.IncomingMesssage](http://nodejs.org/api/http.html#http_http_incomingmessage) object.

## test

    npm test

## todo
- more robust HTML scraping method

## license
This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
