var test = require('tape')
var discover = require('..')

var server = require('./server')

var host
var stopServer

test('starting up server', function(t) {
	t.plan(1)
	server.start(function(addr, close) {
		host = 'http://' + addr.address + ':' + addr.port
		stopServer = close
		t.pass('server listening on ' + host)
	})
})

var paths = [
	'/inHeader/absolute',
	'/inHeader/relative',
	'/inHeader/two', // second one valid
	'/inHTML/absolute',
	'/inHTML/relativ',
	'/inHTML/two' // second one valid
]

paths.forEach(function(path) {
	test(path, function(t) {
		t.plan(3)
		discover(host + path, function(err, meta) {
			t.error(err, 'no error')
			t.ok(meta, 'post exists')
			t.ok(meta.post.content.servers, 'seems to be a meta post')
		})
	})
})

test('no meta post', function(t) {
	t.plan(2)
	discover(host + '/noMetaPost', function(err, meta) {
		t.ok(err, 'errord')
		t.notOk(meta, 'no meta post returned')
	})
})



test('stopping server', function(t) {
	t.plan(1)
	stopServer(function() {
		t.pass('server closed')
	})
})