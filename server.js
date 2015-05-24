//require('http').createServer().on('request',
//    function handleRequest(req, res) {
//        res.writeHead(200, {'content-type' : 'text/plain'});
//        res.write('Hello LOR!');
//        res.end();
//    }
//).listen(3000);

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    cache = {},
    chatServer = require('./lib/chat_server');

chatServer.listen(server);

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {'content-type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

var server = http.createServer(
        function(request, response){
            var filePath = 'public' + ((request.url == '/')? '/index.html' : request.url),
                absPath = './' + filePath;
            serveStatic(response, cache, absPath);
        }
    ),
    chatServer = require('./lib/chat_server');

// Listeners
server.listen(3000, function() {
    console.log('listening to port 3000');
});
chatServer.listen(server);