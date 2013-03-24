var discover = require('./discover')

discover('http://example.com', function(err, profile) {
	if(err) return console.log(err)
	console.log(profile)
})