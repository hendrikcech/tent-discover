var vows = require('vows')
var assert = require('assert')
var discover = require('../discover')

var validEntity = 'https://hendrik.tent.is'
var invalidEntity = 'http://example.ocm'

vows.describe('Testing discover function').addBatch({
	'when discovering valid https test entity': {
		topic: function() { 
			discover('https://hendrik.tent.is', this.callback)
		},

		'returns no error': function(err, profile) {
			assert.isNull(err)  
		},
		'returns profile': function(err, profile) {
			assert.isObject(profile)
		}
	},
	'when discovering not valid test entity': {
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