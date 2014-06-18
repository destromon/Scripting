var user = function() {
    return 'Welcome to user/test page';
};

var detail = function(query) {
    return 'Your name is ' + query.name + ' and you are ' + query.age;
};

var sample = {
    name : 'juan',
    age  : 'dela cruz'
};
exports.load = user;
exports.details = detail;