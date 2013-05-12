var vows = require('vows')
var assert = require('assert')
var discover = require('../discover')

var testServer = require('./testServer')

var location = '0.0.0.0'
var port = 8000


vows.describe('Testing discover functionality').addBatch({
	'starting up testserver': {
		topic: function() {
			testServer.start(location, port, this.callback)
		},

		'started': function(err) {
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
	'no meta post': {
		topic: function() {
			discover('http://'+location+':'+port+'/noMetaPost', this.callback)
		},

		'returns an error': function(err, meta) {
			assert.isNotNull(err)
		},
		'returns no meta post': function(err, meta) {
			assert.isUndefined(meta)
		}
	}
}).export(module)


function discoverPath() {
	var context = {
		topic: function() {
			var req = this.context.name.split(/ +/) // ["/inHeader/relativ", "(comment)"]
			var path = req[0]                       // "/inHeader/relativ"
			var that = this
			discover('http://'+location+':'+port+path, function(err, meta) {
				console.log('callback fired for', path)
				that.callback(err, meta)
			})
		}
	}

	context['returns no error'] = function(err, meta) {
		assert.isNull(err)  
	}
	context['returns meta post'] = function(err, meta) {
		assert.isObject(meta)
		assert.include(meta, 'content')
		assert.include(meta, 'entity')
	}

	return context
}