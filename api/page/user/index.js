module.exports = function() {
    return {
        load : function() {
            return 'Welcome to user/index page';
        },
        
        details : function(query) {
            return 'Your name is ' + query.name + ' and you are ' + query.age;
        },
    }
}