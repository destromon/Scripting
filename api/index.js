var Method = (function() {
    var c = function(url, queryString) {
        this.__construct(url, queryString);
    },
    public = c.prototype;

    /* Public Properties
    --------------------------------------------------------------------------*/
    public.data   = null,
    public.method = null,
    public.url    = null,
    public.qs     = null;
    /* Private Properties
    --------------------------------------------------------------------------*/
        
    /* Loader
    --------------------------------------------------------------------------*/
    /* Construct
    --------------------------------------------------------------------------*/
    public.__construct = function(url, queryString) {
        this.url = url;
        this.qs  = queryString;
        console.log( this.url, this.qs);
    };

    /* Public Methods
    --------------------------------------------------------------------------*/
    public.setRequest = function(method) {
        this.method = method;
    };

    public.getRequest = function() {
        return this.method;
    };

    public.setData = function(data) {
        this.data = data;
    };

    public.getData = function(data) {
        return this.data;
    };
    /* Private Methods
    --------------------------------------------------------------------------*/
    /* Adaptor
    --------------------------------------------------------------------------*/
    return c;
})();

//class
var method = new Method(require('url'), require('querystring'));

//set mimeType
var mimeTypes = {  
    '.js' : 'text/javascript',  
    '.html': 'text/html',  
    '.css' : 'text/css' 
};

var url = require('url'),
path    = require('path'),
http    = require('http'),
fs      = require('fs'),
qs      = require('querystring');

//directory, base file, page
var _dir = 'page/',
base     = '',
page     = '',
file     = '';
    
http.createServer(function(request, response) {
    var post = null;
    //if favicon bug, ignore it
    if (request.url === '/favicon.ico') {  
        response.writeHead(404);
        response.end();  

        return;
    }
    
    //set request method.    
    method.setRequest(request.method);

    //1. check what method is used in form submit.    
    if(method.getRequest() === 'GET') {
        method.setData(url.parse(request.url, true).query);
    } else if(method.getRequest() === 'POST') {
        var body='';
        request.on('data', function(data) {
            body += data;
        });

        request.on('end', function(data) {
            method.setData(qs.parse(body));
        });
    }

    //2. get url
    var requestedUrl = url.parse(decodeURI(request.url), true).path;

    //2.a store url in array
    requestedUrl = requestedUrl.split('/');
    for(var i = 0; i < requestedUrl.length; i++){
        //remove empty string
        if(requestedUrl[i] === '') {
            requestedUrl.splice(i, 1);
        }

        //check if theres a query string in url
        if(requestedUrl[i].indexOf('?') !== -1) {
            //remove it
            requestedUrl[i] = requestedUrl[i].substring(0,requestedUrl[i].indexOf('?'));
        }
    }

    //2.b if url length is 1. then its a folder/index, else its folder/page
    if(requestedUrl.length === 1) {
        base = requestedUrl[0] + '/';
        page = 'index.js';
    } else {
        base = requestedUrl[0] + '/';
        page = requestedUrl[1]  + '.js';
    }
    
    //2.c combine directory, base folder and page.
    file = _dir + base + page;

    //3. check if file exist
    fs.exists(file, function(exists) {
        if(exists) {
            //3.a if it does, try reading it
            fs.readFile(file, function(err, data) {
                //an error will occur if we cant read the file
                if(err) {
                    response.writeHead(500);
                    response.end('Server Error');

                    return;
                }

                //if we can read it, include it!
                var content = require('./' + file)(),
                
                //get header base on extension
                headers = mimeTypes[path.extname(page)];
                response.writeHead(200, headers);


                // if url request greater than or equal to 3, check if its a method
                if(requestedUrl.length >= 3) {
                    if(content.hasOwnProperty(requestedUrl[2])) {
                        response.write(content[requestedUrl[2]](method.getData()));
                        response.end();

                        return;
                    } else {
                        response.write('Method does not exist');
                        response.end();

                        return;
                    }
                }
                
                // else we just need to load the default method
                response.write(content.load());
                response.end();

                return;
            });
            
            return;
        }

        //read previous file and check it.
        if(requestedUrl.length == 2) {
            //load the folder/index
            page = 'index.js';
            base = requestedUrl[1];
            file = _dir + requestedUrl[0] + '/' + page;
        } else {
            //no folder specified, we load the index page.
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
            //an error will occur if we cant read the file
            if(err) {
                response.writeHead(500);
                response.end('Server Error');

                return;
            }

            //if there is no problem, lets require the file
            var content = require('./'+file)();
                headers  = mimeTypes[path.extname(page)];

            //now lets check if there's a method inside this file.
            //instead of 'base' being a folder, now its a function
            if (content.hasOwnProperty(base)) {
                //execute the method
                response.writeHead(200, headers);
                response.write(content[base]());
                response.end();

                return;
            }

            //else throw error.
            response.writeHead(200, headers);
            response.write('Method does not exist');
            response.end();
        });
    });
})
//listen to port, and to localhost too
.listen(8082, 'localhost');

