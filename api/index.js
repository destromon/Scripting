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
    var get = [];
    if (request.url === '/favicon.ico') {  
        response.writeHead(404);
        response.end();  

        return;
    }

    //1. get url
    var requestedUrl = url.parse(decodeURI(request.url), true).path;

    //2. store url to array
    requestedUrl = requestedUrl.split('/');
    for(var i = 0; i < requestedUrl.length; i++){
        if(requestedUrl[i] === '') {
            requestedUrl.splice(i, 1);
        }

        //check if there's a 'GET' request
        if(requestedUrl[i].indexOf('?') !== -1) {
            //get requested data
            var getRequest = requestedUrl[i].substring(requestedUrl[i].indexOf('?')+1, requestedUrl[i].length);
            
            //split each data and convert it to object
            var data = getRequest.split('&');
            var convertedData = {};
            for (var g = 0; g < data.length; g++ ){
                if(data[g].indexOf('=') !== -1) {
                    var newData = data[g].split('=');
                    convertedData[newData[0]] = newData[1];
                }
            }

            //add converted data to 'GET' array
            requestedUrl[i] = requestedUrl[i].substring(0,requestedUrl[i].indexOf('?'));
            get.push(requestedUrl[i]);
            get.push(convertedData);
        }
    }

    console.log('url -> ', requestedUrl);
    console.log('get -> ', get);
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

                response.writeHead(200, headers);

                if(requestedUrl.length >= 3) {
                    if(content.hasOwnProperty(requestedUrl[2])) {
                        console.log('meron');
                        response.writeHead(200, headers);

                        for(var i = 0; i < get.length; i++ ) {
                            //if function name and get name is equal,
                            //pass get as parameter                            
                            if(get[i] ===  requestedUrl[2]) {

                                response.write(content[requestedUrl[2]](get[i+1]));
                                response.end();
                                return;
                            }
                        }

                        response.write(content[requestedUrl[2]](get[1]));
                        response.end();

                        return;
                    } else {
                        response.writeHead(200, headers);
                        response.write('Undefined');
                        response.end();

                        return;
                    }
                }
                
                response.write(content.load());
                response.end();

                return;

            });
            
            return;
        }

        if(requestedUrl.length == 2) {
            //load folder/index
            page = 'index.js';
            base = requestedUrl[1];
            file = _dir + requestedUrl[0] + '/' + page;
        } else {
            //load index page.
            file = _dir + page,
            base = base.substring(base, base.length-1);
        }

        //check if file exists
        fs.exists(file, function(exists) {
            if (!exists) {
                response.writeHead(404);
                response.end('File Not Found');

                return;
            }
        });

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

            response.writeHead(200, headers);
            response.write('Undefined');
            response.end();
        });
    });
})
//listen to port, and to localhost too
.listen(8082, 'localhost');