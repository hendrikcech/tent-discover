var discover = require('../discover')

discover('http://example.tent.is', function(err, meta) {
	if(err) return console.log(err)
	console.log(JSON.stringify(meta.post.content))
})