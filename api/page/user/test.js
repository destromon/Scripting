var user = function() {
    return 'Welcome to user/test page';
};

var detail = function(query) {
    return 'Your name is ' + query.name + ' and you are ' + query.age;
};

var data = function() {
    return 'This is a data method inside user/test.js';
};

exports.load = user;
exports.details = detail;
exports.data = data;