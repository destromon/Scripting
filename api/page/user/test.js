module.exports = function() {
    return {
        load : function() {
            return 'Welcome to user/test page';
        },

        details : function(query) {
            return 'Your name is ' + query.name + ' and you are ' + query.age;
        },
        
        data : function() {
            return 'This is a data method inside user/test.js';            
        },

        employee : function(query) {
            return 'Employee name is ' + query.name + ' and address is ' + query.address;
        }
    }
};