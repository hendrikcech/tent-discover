var discover = require('../discover')

discover('http://0.0.0.0:7239/inHTML/absolute', function(err, meta) {
	if(err) return console.log(err)
	console.log(meta)
	console.log(meta.content.servers)
})