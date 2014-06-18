jQuery.fn.extend({
	resize: function(handle) {
		//listen when mouse is clicked
		var resize 		= $(handle);
		resize.mousedown(function(e){
			//get current width and heigth of the box
			var box		= $(handle,this),
			boxHeight 	= box.css('height'),
			boxWidth 	= box.css('width'),
			//variable for new width and height
			prevPosX	= 0,
			prevPosY	= 0,
			newWidth	= 0,
			newHeight	= 0;
			//get current position
			prevPosX = e.clientX;
			prevPosY = e.clientY;
			$(window).mousemove(function(e){
				//computation for new width and height
				newHeight = parseInt(boxHeight) + (e.clientY - prevPosY);
				newWidth = parseInt(boxWidth)  + (e.clientX - prevPosX);
				//set changes to box
				box.css({
					width 	: newWidth,
					height  : newHeight
				});
			});
		});
		//listen on mouse up
		$(window).mouseup(function(){
			//unbind mouse move event
			$(window).unbind('mousemove');
		});
	}
});