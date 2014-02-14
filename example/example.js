var discover = require('../discover')

var entity = process.argv[2]
if(!entity) {
	console.error('usage: node example.js http://entity.com')
	process.exit(1)
}

discover(entity, function(err, meta) {
	if(err) return console.log(err)
	console.log(meta)
})