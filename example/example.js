var discover = require('../discover')

discover('http://localhost:8000/inHTML', function(err, profile) {
	if(err) return console.log(err)
	console.log(profile)
})