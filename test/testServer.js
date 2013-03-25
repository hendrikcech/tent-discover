var http = require('http')

var locationG = null
var portG = null

var server = http.createServer(function (req, res) {
	switch(req.url) {
		case '/inHeader':
			res.writeHead(200, {
				'link': [
					'<http://'+locationG+':'+portG+'/noProfile>; rel="https://tent.io/rels/profile',
					'</profile>; rel="https://tent.io/rels/profile'
				]
			})
			res.end('jaja, bla hier bitte')
		break
		case '/inHTML':
			var html = "<!DOCTYPE html><html lang=\"en\">  <head><meta content=\"width=device-width, initial-scale=1.0\" name=\"viewport\" />    <title>Tent - the decentralized social web</title>    <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-cb0b9b6b1fd.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />    <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/bootstrap-responsive-cb3a254477b.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />  <link href=\"http://"+locationG+":"+portG+"/profile\" rel=\"https://tent.io/rels/profile\" /> <link href=\"/profile\" rel=\"https://tent.io/rels/profile\" /> <link href=\"https://d31dxsia6hg3x2.cloudfront.net/assets/css/style-cb8d80f1e01.css\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" /></head><body></body></html>"
			res.writeHead(200)
			res.end(html)
		break
		case '/noProfile':
			res.writeHead(200)
			res.end('everything, but no profile')
		break
		case '/profile':
			var profile = {
				"https:\/\/tent.io\/types\/info\/basic\/v0.1.0": {
					"name": "Hendrik Cech",
					"avatar_url": "http:\/\/www.gravatar.com\/avatar\/5a21fcfa05ac7d496a399e44c6cc60a8.png?size=200",
					"birthdate": "01.07.1995",
					"location": "Braunschweig, Germany",
					"gender": "",
					"bio": "",
					"permissions": {
						"public": true
					},
					"version": 1
				},
				"https:\/\/tent.io\/types\/info\/core\/v0.1.0": {
					"entity": "https:\/\/hendrik.tent.is",
					"licenses": [
							
					],
					"servers": [
						"https:\/\/hendrik.tent.is\/tent"
					],
					"permissions": {
						"public": true
					},
					"version": 1,
					"tent_version": "0.2"
				}
			}
			res.writeHead(200)
			res.end(JSON.stringify(profile))
		break
		default:
			res.writeHead(404)
			res.end('404')
		break
	}
})

module.exports.start = function(location, port, callback) {
	locationG = location
	portG = port
	server.listen(port, location, callback)
}

module.exports.start('127.0.0.1', 8000)