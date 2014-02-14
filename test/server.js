var http = require('http')

module.exports.start = function(cb) {
	var server = http.createServer(function (req, res) {		
		var handler = handlers[req.url]
		if(handler) {
			handler(res, server.address())
		} else {
			res.writeHead(404)
			res.end('404')
		}
	})

	server.on('error', function(err) {
		console.error(err)
	})

	server.listen(0, function() {
		cb(server.address(), server.close.bind(server))
	})
}

var rel = 'https://tent.io/rels/meta-post'

var metaPost = {
	"post": {
		"content": {
			"entity": "http://bb216a47d970.alpha.attic.is",
			"servers": [
				{
					"version": "0.3",
					"preference": 0,
					"urls": {
						"oauth_auth": "http://bb216a47d970.alpha.attic.is/oauth",
						"oauth_token": "http://bb216a47d970.alpha.attic.is/oauth/authorization",
						"posts_feed": "http://bb216a47d970.alpha.attic.is/posts",
						"post": "http://bb216a47d970.alpha.attic.is/posts/{entity}/{post}",
						"new_post": "http://bb216a47d970.alpha.attic.is/posts",
						"post_attachment": "http://bb216a47d970.alpha.attic.is/posts/{entity}/{post}/{version}/attachments/{name}",
						"attachment": "http://bb216a47d970.alpha.attic.is/attachments/{entity}/{digest}",
						"batch": "http://bb216a47d970.alpha.attic.is/batch",
						"server_info": "http://bb216a47d970.alpha.attic.is/server"
					}
				}
			]
		},
		"entity": "http://bb216a47d970.alpha.attic.is",
		"id": "meta",
		"published_at": 1367975276607,
		"type": "https://tent.io/types/meta/v0#",
		"version": {
			"id": "c93cce07e41840588eb567ba3c9469409baa552a5abac92010a7ddbb0a26e265"
		}
	}
}

function getMetaUrl(server) {
	return 'http://'+server.address+':'+server.port+'/meta-post'
}

var handlers = {
	'/inHeader/absolute': function(res, server) {
		res.writeHead(200, {
			'link': [
				'<'+getMetaUrl(server)+'>; rel="'+rel+'"'
			]
		})
		res.end('jaja, bla hier bitte')
	},
	'/inHeader/relative': function(res) {
		res.writeHead(200, {
			'link': [
				'</meta-post>; rel="'+rel+'"'
			]
		})
		res.end('jaja, bla hier bitte')
	},
	'/inHeader/two': function(res) {
		res.writeHead(200, {
			'link': [
				'</noMetaPost>; rel="'+rel+'"',
				'</meta-post>; rel="'+rel+'"'
			]
		})
		res.end('jaja, bla hier bitte')
	},
	'/inHTML/absolute': function(res, server) {
		var links = '<link href="'+getMetaUrl(server)+'" rel="'+rel+'" />'
		var html = generateHTML(links)
		res.writeHead(200)
		res.end(html)
	},
	'/inHTML/relativ': function(res) {
		var html = generateHTML('<link href="/meta-post" rel="'+rel+'" />')
		res.writeHead(200)
		res.end(html)
	},
	'/inHTML/two': function(res) {
		var links = '<link href="/noMetaPost" rel="'+rel+'" />'
			+ '<link href="/meta-post" rel="'+rel+'" />'
		var html = generateHTML(links)
		res.writeHead(200)
		res.end(html)
	},
	'/noMetaPost': function(res) {
		var trickHtml = generateHTML('')
		res.writeHead(200, {
			'link': [
				'</meta-post>; rel="https://itsATrap.com'
			]
		})
		res.end(trickHtml)
	},
	'/meta-post': function(res) {
		res.writeHead(200)
		res.end(JSON.stringify(metaPost))
	}
}
 
function generateHTML(inject) {
	var html = '<!DOCTYPE html><html lang="en">  <head><meta content="width=device-width, initial-scale=1.0" name="viewport" />    <title>Tent - the decentralized social web</title>    <link href="https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-cb0b9b6b1fd.css" media="screen" rel="stylesheet" type="text/css" />    <link href="https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-responsive-cb3a254477b.css" media="screen" rel="stylesheet" type="text/css" /> ' + inject + ' <link href="https://d31dxsia6hg3x2.cloudfront.net/assets/css/style-cb8d80f1e01.css" media="screen" rel="stylesheet" type="text/css" /></head><body></body></html>'
	return html
}