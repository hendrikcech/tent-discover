var vows = require('vows')
var assert = require('assert')
var discover = require('../discover')

var testServer = require('./testServer')

var location = '127.0.0.1'
var port = 8000

vows.describe('Testing discover functionality').addBatch({
	'starting up testserver': {
		topic: function() {
			testServer.start(location, port, this.callback)
		},

		'started': function() {
			assert.isNull(null)
		}
	}
}).addBatch({
	'profile in header': {
		topic: function() {
			discover('http://'+location+':'+port+'/inHeader', this.callback)
		},

		'returns no error': function(err, profile) {
			assert.isNull(err)  
		},
		'returns profile': function(err, profile) {
			assert.isObject(profile)
		}
	},
	'profile in HTML': {
		topic: function() {
			discover('http://'+location+':'+port+'/inHTML', this.callback)
		},

		'returns no error': function(err, profile) {
			assert.isNull(err)  
		},
		'returns profile': function(err, profile) {
			assert.isObject(profile)
		}
	},
	'not valid test entity': {
		topic: function() {
			discover('http://example.com', this.callback)
		},

		'returns an error': function(err, profile) {
			assert.isNotNull(err)
		},
		'returns no profile': function(err, profile) {
			assert.isUndefined(profile)
		}
	}
}).export(module)