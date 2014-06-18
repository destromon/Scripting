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

    //get url and split to get base dir.
    var requestedUrl = url.parse(decodeURI(request.url), true).pathname.split('/');
    
    //remove empty strings
    for(var i = 0; i < requestedUrl.length; i++) {
        if(requestedUrl[i] === '') {
            requestedUrl.splice(i, 1);
        }
    }
    
    //if index 0 is empty, most likely we are in the index
    if(requestedUrl.length === 1) {
        page = 'index.js';
        base = requestedUrl[0];
    } else {
        base = requestedUrl[0];
        page = requestedUrl[1] + '.js';
        
    }

    file = _dir + base + '/' + page; 
    console.log(file);
    //add file directory and page
    //check if file exist
    fs.exists(file, function(exists) {
        if(exists) {
            //read file content
            fs.readFile(file, function (err, data) {
                //if error
                if(err) {
                    //it means theres a file but we can't access the file (cant read file)
                    response.writeHead(500);
                    response.end('Server Error');

                    return;
                }

                //if not, now we can require the file
                var content = require('./' + file);

                //header will be based on extension
                var headers = {'Content-type' : mimeTypes[path.extname(page)]};
                
                //if theres only one url, load main page.
                if(requestedUrl.length === 1 || requestedUrl.length === 2){
                    //call page function
                    response.writeHead(200, headers);
                    response.write(typeof content.load === 'function' ? content.load().toString() : 'No function found'); 
                    response.end();

                    return;     
                } else {
                    if (content.hasOwnProperty(requestedUrl[2])) {
                        response.writeHead(200, headers);
                        response.write(content[requestedUrl[2]]().toString());
                        response.end();    

                        return;
                    } else {
                        response.writeHead(404);
                        response.write('No function found.');
                        response.end();                            
                    }

                }
            });

            return;
        }

        response.writeHead(404);
        response.end('Page Not Found!');
    });
})
//listen to port, and to localhost too
.listen(8082, 'localhost');

