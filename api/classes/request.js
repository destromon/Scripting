module.exports = (function() {
    var c = function() {}, public = c.prototype;
    /* Public Properties
    --------------------------------------------------------------------------*/
    /* Private Properties
    --------------------------------------------------------------------------*/
    var _url = require('url'),
    _qs      = require('querystring');
    /* Loader
    --------------------------------------------------------------------------*/
    /* Construct
    --------------------------------------------------------------------------*/
    /* Public Methods
    --------------------------------------------------------------------------*/
    /**
     * get url data and method
     * 
     * @param mixed
     * @param mixed
     * @param function callback
     */

    public.setRequest = function(server, request, response) {
        console.log('we are calling the request tibayo');
        //get request
        var requestData = null;
        if(request.method === 'GET') {
            var url = require('url');
            requestData = url.parse(request.url, true).query;
            //callback(request, response, requestData);
            server.action.emit('routing', server, request, response, requestData);
        } else if(request.method === 'POST') {
            var body='';
            request.on('data', function(data) {
                body += data;
            });

            request.on('end', function(data) {
                var qs = require('querystring');
                requestData = qs.parse(body);
                //callback(request, response, requestData);
                server.action.emit('routing', server, request, response, requestData);
            });
        } else if(request.method === 'PUT') {
            var body='';
            request.on('data', function(data) {
                body += data;
            });

            request.on('end', function(data) {
                var qs = require('querystring');
                requestData = qs.parse(body);
                //callback(request, response, requestData);
                server.action.emit('routing', server, request, response, requestData);
            });
        }
        //trigger next action
        //server.action.emit('next event', requestedData);
        //trigger url routing
    };

    /* Private Methods
    --------------------------------------------------------------------------*/
    /* Adaptor
    --------------------------------------------------------------------------*/
    return c;
})();