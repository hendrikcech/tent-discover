var request = require('hyperdirect').request
var concat = require('concat-stream')
var urlMod = require('url')
var debug = require('debug')('tent-discover')

module.exports = function(url, callback) {
	debug('request', url)

	var req = request(url, { method: 'HEAD' })

	req.on('error', function (err) {
		return callback(err)
	})

	req.on('response', function (res) {
		var linkHeader = res.headers.link
		
		if(!linkHeader) return searchHTML(url, callback)

		linkHeader = linkHeader.split(',') //split, if there are multiple urls

		debug('link header', linkHeader)

		var metaURLs = []
		linkHeader.forEach(function(link) {
			debug('test', link)
			// tent link?
			if(link.match(/https:\/\/tent.io\/rels\/meta-post/i)) {
				debug('is tent link')
				// get metaURL
				var metaURL = link.match(/<([^>]*)>/)
				if(metaURL) {
					debug('meta url found', metaURL)
					metaURL = processURL(metaURL[1], url)
					metaURLs.push(metaURL)
				}
			}
		})

		if(metaURLs.length === 0) {
			searchHTML(url, callback) //no links in header
		} else {
			debug('meta uris in link headers found, fetch posts')
			getMeta(metaURLs, callback)
		}
	})
}

function searchHTML(url, callback) {
	debug('no link header, request html')

	var req = request(url, { method: 'GET' })

	req.on('error', callback)
	
	req.pipe(concat({ encoding: 'string' }, function(data) {
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
	debug('before processing', metaURL)
	
	metaURL = urlMod.parse(metaURL)

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

	debug('after processing', metaURL)

	return metaURL
}

function getMeta(metaURLs, callback) {
	var i = 0
	var tryURL = function() {
		if(!metaURLs[i]) return callback(new Error('No meta post found (2)'))

		debug('fetch no.' + (i+1), metaURLs[i])

		var req = request(metaURLs[i], { method: 'GET' })

		req.on('error', callback)

		var response
		req.on('response', function(res) { response = res })

		req.pipe(concat({ encoding: 'string' }, function(data) {
			try {
				data = JSON.parse(data)
			} catch(e) {
				i++
				return tryURL()
			}

			if(response.statusCode < 200 || response.statusCode >= 300) {
				i++
				debug('failed try, next url', response.statusCode)
				return tryURL()
			}
			callback(null, data, response)
		}))
	}
	tryURL()
}