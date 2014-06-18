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
detail(sample);
// exports.load = user;
// exports.details = detail;

var menu = [{
            label: 'Item 1',
            children: [{
                label: 'Item 1a',
                children: [{
                    label: 'Item 1a1',
                    children: []
                }, {
                    label: 'Item 1a2',
                    children: []
                }]
            }, {
                label: 'Item 1b',
                children: [{
                    label: 'Item 1b1',
                    children: []
                }, {
                    label: 'Item 1b2',
                    children: []
                }]
            }]
        }, {
            label: 'Item 2',
            children: [{
                label: 'Item 2a',
                children: [{
                    label: 'Item 2a1',
                    children: []
                }, {
                    label: 'Item 2a2',
                    children: []
                }]
            }, {
                label: 'Item 2b',
                children: [{
                    label: 'Item 2b1',
                    children: []
                }, {
                    label: 'Item 2b2',
                    children: []
                }]
            }]
        }];

var Menu = (function() {
    var c = function() {}, public = c.prototype;
    
    /* Public Properties
    --------------------------------------------------------------------------*/
    /* Private Properties
    --------------------------------------------------------------------------*/
    /* Loader
    --------------------------------------------------------------------------*/
    /* Construct
    --------------------------------------------------------------------------*/
    /* Public Methods
    --------------------------------------------------------------------------*/
    /**
     * Render menu
     * 
     * @param object
     * @param string
     */
    public.renderMenu = function(menu, parent) {
        //check if it's an object array
        if (!(menu instanceof Array) || !menu.length) {
            console.log('this is not an array!');
            return;
        }
        
        //create a ul
        var ul = document.createElement('ul');

        //add ul to parent
        parent.appendChild(ul);

        //loop through array menu
        for(var i = 0; i < menu.length; i++) {
            
            //create list item
            var li = document.createElement('li');
            li.innerHTML = menu[i].label;
            
            //append list item to ul
            ul.appendChild(li);

            //check if current index has child
            if(menu[i].hasOwnProperty('children')) {
                //call this method.
                //pass current index as the parameter
                this.renderMenu(menu[i].children, li);
            }
        }
    };

    /* Private Methods
    --------------------------------------------------------------------------*/
    /* Adaptor
    --------------------------------------------------------------------------*/
    return c;
})();

(new Menu()).renderMenu(menu, document.getElementById('menu'));