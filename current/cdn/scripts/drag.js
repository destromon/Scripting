jQuery.fn.extend({
	drag: function(handle){
		//Drag functionality
		var boxPosition 	= { top: 0, left: 0 }, 
			mousePosition 	= { top: 0, left: 0 }, 
			box 			= $(this);
			handle			= $(handle, this);
		
		// When user mouses down on the header 
		$(handle, box).mousedown(function(e) {
			//1. Capture the box position
			boxPosition.top = box.offset().top;
			boxPosition.left = box.offset().left;
			//2. Capture the mouse position
			mousePosition.top = e.clientY;
			mousePosition.left = e.clientX;
			//3. Listen to mouse move
			$(window).mousemove(function(e) {
				//3a. Capture the mouse position
				var  mousePositionNow = {
					top: e.clientY,
					left: e.clientX };
				
				//3b. Calculate where the box should be
				var boxPositionNow = {
					top: (mousePositionNow.top - mousePosition.top) + boxPosition.top,
					left: (mousePositionNow.left - mousePosition.left) + boxPosition.left };
				
				//don't let the top box go past the window screen
				if(boxPositionNow.top < 0) {
					boxPositionNow.top = 0;
				}
				
				//don't let the left box go past the window screen
				if(boxPositionNow.left < 0) {
					boxPositionNow.left = 0;
				}
				
				//3c. Update box
				box.css({
					top: boxPositionNow.top + 'px',
					left: boxPositionNow.left + 'px' });
			});	
		});	
		
		// When user mouses up 
		$(window).mouseup(function() {
			//stop listening to the mouse move
			$(this).unbind('mousemove');
		});

		return this;
	}

});