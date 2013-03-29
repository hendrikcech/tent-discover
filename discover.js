var request = require('tent-request')
var urlMod = require('url')

module.exports = function(url, callback) {
	request({
		method: 'head',
		url: url
	}, function(err, body, res) {
		if(err) return callback(err)

		var linkHeader = res.headers.link

		if(!linkHeader) return searchHTML(url, callback)

		linkHeader = linkHeader.split(',') //split, if there are multiple urls

		var profileURLs = []
		linkHeader.map(function(link) {
			if(link.match(/https:\/\/tent.io\/rels\/profile/i)) { //tent link?
				var profileURL = link.match(/<([^>]*)>/) //get profileURL
				if(profileURL) {
					profileURL = processURL(profileURL[1], url)
					profileURLs.push(profileURL)
				}
			}
		})

		if(profileURLs.length === 0) searchHTML(url, callback) //no links in header
		else getProfile(profileURLs, callback)
	})
}

function searchHTML(url, callback) {
	request({
		method: 'get',
		url: url
	}, function(err, body) {
		if(err) return callback(err)
		var profileURLs = []

		var linkTag = /<link href="([^"]+)" rel="https:\/\/tent\.io\/rels\/profile"/
		var profileURL = linkTag.exec(body)
		if(profileURL) {
			profileURL = processURL(profileURL[1], url)
			profileURLs.push(profileURL)
		}

		if(profileURLs.length > 0) getProfile(profileURLs, callback)
		else callback('No profile found')
	})
}

function processURL(profileURL, url) {
	profileURL = urlMod.parse(profileURL)
	if(!profileURL.host) { //relative url?
		var parsedURL = urlMod.parse(url)

		//merge profileURL and parsedURL
		var newObj = {}
		for (var attrname in parsedURL) { newObj[attrname] = parsedURL[attrname]; }
		for (var attrname in profileURL) { newObj[attrname] = profileURL[attrname]; }
		profileURL = newObj
	}
	profileURL = urlMod.format(profileURL)
	return profileURL
}

function getProfile(profileURLs, callback) {
	var i = 0
	var tryURL = function() {
		if(!profileURLs[i]) return callback('No profile found')

		request({
			method: 'get',
			url: profileURLs[i]
		}, function(err, body, res) {
			if(err || typeof body !== 'object') {
				//console.log(err)
				i++
				return tryURL()
			}
			callback(null, body)
		})
	}
	tryURL()
}