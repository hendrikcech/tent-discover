var request = require('request')

/* gets the profile of the provided entity */
module.exports = function(entity, callback) {

	getProfileUrl(entity, function(err, profileUrl) {
		if(err) {
			return callback(err)			
		}
		getProfile(profileUrl, function(err, profile) {
			if(err) {
				return callback(err)
			}
			callback(null, profile)
		})
	})
}

/* performes a head request to the provided entity url to get the link to the tent profile */
function getProfileUrl(entity, callback) {
	request.head({
		url: entity,
		headers: {'Accept': 'application/vnd.tent.v0+json'}
		},
		function(err, resp, body) {
			if(err) {
				return callback('Error discovering entity: '+ err)	
			}
			if(!resp.headers.link) {
				return callback(new Error('No link to tent profile in header'))
			}

			//parsing profileURL out of link header (props to https://github.com/bastinat0r/node-tent-client/blob/master/tent.js#L44)
			var profileUrl = /<[^>]*>/.exec(resp.headers.link)
			profileUrl = (''+profileUrl).replace(/[<>]/g, '')

			var regEx = /^(https:\/\/|http:\/\/)/
			var absoluteUrl = regEx.test(profileUrl)
			if(!absoluteUrl) {
				profileUrl = entity + profileUrl
			}

			callback(null, profileUrl)
		}
	)
}

/* gets the public profile of the provided entity */
function getProfile(profileUrl, callback) {
	request.get({
		url: profileUrl,
		headers: {'Accept': 'application/vnd.tent.v0+json'}
		}, function(err, resp, body) {
			if(err || (resp.statusCode != 200 && resp.statusCode != 404)) {
				return callback('Error fetching profile:' +err)
			} else if(resp.statusCode == 404) {
				return callback(new Error('Profil not found'))
			}
			var body = JSON.parse(body) //convert string
			callback(null, body)
		}
	)
}