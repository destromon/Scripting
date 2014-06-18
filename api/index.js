//set mimeType
var mimeTypes = {  
    '.js' : 'text/javascript',  
    '.html': 'text/html',  
    '.css' : 'text/css' 
};

var url = require('url'),
   path = require('path'),
   http = require('http'),
   fs   = require('fs');

//directory, base file, page
var _dir = 'page/',
    base = '',
    page = '',
    file = '';

http.createServer(function(request, response) {
    if (request.url === '/favicon.ico') {  
        response.writeHead(404);
        response.end();  

        return;
    }

    //1. get url
    var requestedUrl = url.parse(decodeURI(request.url), true).path.split('/');

    //2. store url to array
    for(var i = 0; i < requestedUrl.length; i++){
        if(requestedUrl[i] === '') {
            requestedUrl.splice(i, 1);
        }
    }
    console.log(requestedUrl);

    //2.a. if url length is 1. then its a folder/index, else its folder/page
    if(requestedUrl.length === 1) {
        base = requestedUrl[0] + '/';
        page = 'index.js';
    } else {
        base = requestedUrl[0] + '/';
        page = requestedUrl[1]  + '.js';
    }
    
    //2.b. combine directory, base folder and page.
    file = _dir + base + page;

    console.log(file);
    //3. check if file exist
    fs.exists(file, function(exists) {
        if(exists) {
            //3.a. it exists, lets include it!
            fs.readFile(file, function(err, data) {
                if(err) {
                    response.writeHead(500);
                    response.end('Server Error');

                    return;
                }

                var content = require('./' + file),
                headers = mimeTypes[path.extname(page)];

                response.writeHead(200, headers)
                response.write(content.load());
                response.end();

                return;

            });
            
            return;
        }

        //4. if it is not a file, check maybe it is a method
        file = _dir + page,
        base = base.substring(base, base.length-1);
        //read file
        fs.readFile(file, function(err, data) {
            //an error will be returned if we cant access the file
            if(err) {
                response.writeHead(500);
                response.end('Server Error');

                return;
            }

            //if there is no problem, lets require the file
            var content = require('./'+file);
                headers  = mimeTypes[path.extname(page)];

            //now lets check if there's a method inside this file.
            if (content.hasOwnProperty(base)) {
                //execute the method
                response.writeHead(200, headers);
                response.write(content[base]());
                response.end();

                return;
            }

            console.log('walang method n ganyan')
            response.writeHead(200, headers);
            response.write('Undefined');
            response.end();
        });
    });
})
//listen to port, and to localhost too
.listen(8082, 'localhost');