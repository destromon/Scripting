var Server    = require('./classes/server.js'),
server        = new Server(),
Request       = require('./classes/request.js'),
serverRequest = new Request(),
Routing   = require('./classes/routing.js'),
routing   = new Routing();


//server.action.on('strangerIsKnocking', server.test);

//listen to request, and execute setRequest function;
server.action.on('request', serverRequest.setRequest);

//listen to request, and execute setRequest function;
server.action.on('routing', routing.renderPage);

require('http').createServer(function(request, response) {    
    //if favicon bug, ignore it
    if (request.url === '/favicon.ico') {  
        response.writeHead(404);
        response.end();  

        return;
    }

    //trigger request
    server.action.emit('request', server, request, response);
})
//listen to port, and to localhost too
.listen(8082, 'localhost');