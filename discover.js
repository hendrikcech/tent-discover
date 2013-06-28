var request = require('hyperdirect').request
var concat = require('concat-stream')
var urlMod = require('url')

module.exports = function(url, callback) {
	
	var req = request(url, { method: 'HEAD' })

	req.on('error', function (err) { return callback(err) })
	req.on('response', function (res) {
		var linkHeader = res.headers.link
		
		if(!linkHeader) return searchHTML(url, callback)

		linkHeader = linkHeader.split(',') //split, if there are multiple urls

		var metaURLs = []
		linkHeader.forEach(function(link) {
			if(link.match(/https:\/\/tent.io\/rels\/meta-post/i)) { //tent link?
				var metaURL = link.match(/<([^>]*)>/) //get metaURL
				if(metaURL) {
					metaURL = processURL(metaURL[1], url)
					metaURLs.push(metaURL)
				}
			}
		})

		if(metaURLs.length === 0) searchHTML(url, callback) //no links in header
		else getMeta(metaURLs, callback)
	})

	req.end()
}

function searchHTML(url, callback) {
	var req = request(url, { method: 'GET' })
	
	req.pipe(concat(function(err, data) {
		if(err) return callback(err)
		var metaURLs = []

		var linkTag =
			/<link href="([^"]+)" rel="https:\/\/tent\.io\/rels\/meta-post"/g
		var metaURL
		while(metaURL = linkTag.exec(data)) {
			metaURL = processURL(metaURL[1], url)
			metaURLs.push(metaURL)
		}
		
		if(metaURLs.length > 0) getMeta(metaURLs, callback)
		else callback(new Error('No meta post found (1)'))
	}))
}

function processURL(metaURL, url) {
	metaURL = urlMod.parse(metaURL)
	//console.log('HOST' + metaURL.host + 'YO' + typeof metaURL.host +'YO' +url)
	if(metaURL.host === null) { //relative url?
		var parsedURL = urlMod.parse(url)
		
		//merge metaURL and parsedURL
		var newObj = {}
		for (var attrname in parsedURL) {
			newObj[attrname] = parsedURL[attrname]
		}
		for (var attrname in metaURL) { 
			if(metaURL[attrname] !== null)
				newObj[attrname] = metaURL[attrname]
		}
		metaURL = newObj
	}
	metaURL = urlMod.format(metaURL)
	return metaURL
}

function getMeta(metaURLs, callback) {
	var i = 0
	var tryURL = function() {
		if(!metaURLs[i]) return callback(new Error('No meta post found (2)'))

		//console.log('try', metaURLs[i])

		var req = request(metaURLs[i], { method: 'GET' })

		var statusCode
		req.on('response', function(res) { statusCode = res.statusCode })

		req.pipe(concat(function(err, data) {
			if(err) return callback(new Error(metaURLs[i] + err))
			try {
				data = JSON.parse(data)
			} catch(e) {
				i++
				return tryURL()
			}

			if(statusCode < 200 || statusCode >= 300) {
				i++
				return tryURL()
			}
			callback(null, data)
		}))
	}
	tryURL()
}