var test = require('tap').test
var discover = require('../discover.js')

test('discover test entity (https://hendrik.tent.is)', function(t) {
	discover('https://hendrik.tent.is', function(err, profile) {
		t.ok(!err, 'error returned: '+err)
		t.equal(typeof profile, 'object', 'profile typeof object')
		t.ok(profile, 'no profile returned: '+profile)
	
		t.end()
	})
})
