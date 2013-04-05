var request = require('tent-request')
var urlMod = require('url')

module.exports = function(url, callback) {
	request({
		method: 'head',
		url: url
	}, function(err, res, body) {
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
	}, function(err, res, body) {
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
	//console.log('HOST' + profileURL.host + 'YO' + typeof profileURL.host +'YO' +url)
	if(profileURL.host === null) { //relative url?
		var parsedURL = urlMod.parse(url)
		
		//merge profileURL and parsedURL
		var newObj = {}
		for (var attrname in parsedURL) {
			newObj[attrname] = parsedURL[attrname]
		}
		for (var attrname in profileURL) { 
			if(profileURL[attrname] !== null)
				newObj[attrname] = profileURL[attrname]
		}
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
		}, function(err, res, body) {
			if(err) return callback(profileURLs[i] + err)
			if(res.statusCode < 200 || res.statusCode >= 300 || typeof body !== 'object') {
				i++
				return tryURL()
			}
			callback(null, body)
		})
	}
	tryURL()
}