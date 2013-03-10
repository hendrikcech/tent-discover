var request = require('request')
var post = require('tent-post')

/* gets the profile of the provided entity */
module.exports = function(entity, callback) {

	/* performes a head request to the provided entity url to get the link to the tent profile */
	post('head', entity, null, null, function(err, body, resp) {
		if(err) return callback(err)

		//parsing profileURL out of link header (props to https://github.com/bastinat0r/node-tent-client/blob/master/tent.js#L44)
		var profileUrl = /<[^>]*>/.exec(resp.headers.link)
		profileUrl = (''+profileUrl).replace(/[<>]/g, '')

		var regEx = /^(https:\/\/|http:\/\/)/
		var absoluteUrl = regEx.test(profileUrl)
		if(!absoluteUrl) {
			profileUrl = entity + profileUrl
		}
		
		/* gets the public profile of the provided entity */
		post('get', profileUrl, null, null, function(err, body, resp) {
			if(err || (resp.statusCode != 200 && resp.statusCode != 404)) {
				return callback('Error fetching profile:' +err)
			} else if(resp.statusCode == 404) {
				return callback(new Error('Profil not found'))
			}
			callback(null, body)
		})
	})
}