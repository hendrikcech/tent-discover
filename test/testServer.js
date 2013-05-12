var http = require('http')

var locationG = null
var portG = null
module.exports.start = function(location, port, callback) {
	locationG = location
	portG = port
	server.listen(port, location, function() {
		console.log('listening!')
		callback(null)
	})
	// setTimeout(function() {
	// 	callback()
	// }, 2000)
}

var rel = 'https://tent.io/rels/meta-post'

var server = http.createServer(function (req, res) {
	//if(req.url !== '/favicon.ico') console.log(req.url)
	
	switch(req.url) {
		case '/inHeader/absolute':
			res.writeHead(200, {
				'link': [
					'<http://'+locationG+':'+portG+'/meta-post>; rel="'+rel+'"'
				]
			})
			res.end('jaja, bla hier bitte')
		break
		case '/inHeader/relative':
			case '/inHeader/absolute':
				res.writeHead(200, {
					'link': [
						'</meta-post>; rel="'+rel+'"'
					]
				})
				res.end('jaja, bla hier bitte')
		break
		case '/inHeader/two':
			case '/inHeader/absolute':
				res.writeHead(200, {
					'link': [
						'</noMetaPost>; rel="'+rel+'"',
						'</meta-post>; rel="'+rel+'"'
					]
				})
				res.end('jaja, bla hier bitte')
		break
		case '/inHTML/absolute':
			var html = generateHTML('<link href=\"http://'+locationG+':'+portG+'/meta-post\" '
					+ 'rel=\"'+rel+'\" />')
			res.writeHead(200)
			res.end(html)
		break
		case '/inHTML/relativ':
			var html = generateHTML('<link href=\"/meta-post\" rel=\"'+rel+'\" />')
			res.writeHead(200)
			res.end(html)
		break
		case '/inHTML/two':
			var html = generateHTML('<link href=\"/noMetaPost\" rel=\"'+rel+'\" />'
					+ '<link href=\"/meta-post\" rel=\"'+rel+'\" />')
			res.writeHead(200)
			res.end(html)
		break
		case '/noMetaPost':
			var trickHtml = generateHTML('')
			res.writeHead(200, {
				'link': [
					'</meta-post>; rel="https://itsATrap.com'
				]
			})
			res.end(trickHtml)
		break
		case '/meta-post':
			var metaPost = {
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
			res.writeHead(200)
			res.end(JSON.stringify(metaPost))
		break
		default:
			res.writeHead(404)
			res.end('404')
		break
	}
})

server.on('error', function(exception, socket) {
	console.log(exception)
	console.log(socket)
})
 
function generateHTML(inject) {
	var html = "<!DOCTYPE html><html lang=\"en\">  <head><meta content=\"width=device-width, initial-scale=1.0\" name=\"viewport\" />    <title>Tent - the decentralized social web</title>    <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-cb0b9b6b1fd.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />    <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-responsive-cb3a254477b.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" /> " + inject + " <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/style-cb8d80f1e01.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" /></head><body></body></html>"
	return html
}

//module.exports.start('0.0.0.0', 7239, new Function())