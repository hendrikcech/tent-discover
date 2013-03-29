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
	'/inHeader/absolute': discoverPath(),
	'/inHeader/relative': discoverPath(),
	'/inHeader/two (second one valid)': discoverPath(),
	
	'/inHTML/absolute': discoverPath(),
	'/inHTML/relativ': discoverPath(),
	'/inHTML/two (second one valid)': discoverPath(),
	'no profile': {
		topic: function() {
			discover('http://'+location+':'+port+'/noProfile', this.callback)
		},

		'returns an error': function(err, profile) {
			assert.isNotNull(err)
		},
		'returns no profile': function(err, profile) {
			assert.isUndefined(profile)
		}
	}
}).export(module)


function discoverPath() {
	var context = {
		topic: function() {
			var req = this.context.name.split(/ +/) // ["/inHeader/relativ", "(comment)"]
			var path = req[0]                       // "/inHeader/relativ"
			discover('http://'+location+':'+port+path, this.callback)
		}
	}

	context['returns no error'] = function(err, profile) {
		assert.isNull(err)  
	}
	context['returns profile'] = function(err, profile) {
		assert.include(profile, 'https://tent.io/types/info/core/v0.1.0')
		assert.isObject(profile)
	}

	return context
}