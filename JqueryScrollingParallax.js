	// Paralax Image Effect
	// Creator: Austin Perez
	//
	// How to use:
	//
	// Include the 'data-js-scroll-animation' attribute on the element
	// that you would like to animate. See example below:
	//
	// Example:
	// 
	//   data-js-scroll-animation='{ "translateFrom": { "large":[0, 60]}, "translateTo": { "large":[0, -50]}}'

	$(document).ready(addInitialTransformCss);
	$(document).on('scroll', scrollAnimation);


	var elements = elementArray();

	function elementArray() {

		// Finds all elements with 'data-js-scroll-animation' attribute
		// and adds the id's of the elements to an array
		//
		var objectArray = [];
		var objects = $('[data-js-scroll-animation]');
		if (objects.length > 0) {
			for (var i = objects.length - 1; i >= 0; i--) {
			 	objectArray.push('#' + objects[i].id);
			}
			return objectArray;
		} else {
			return null;
		}
	}

	function addInitialTransformCss() {

		if (elements != null) {
			for (var i = elements.length - 1; i >= 0; i--) {
		 		var systemProperties = getScrollAnimationProperties($(elements[i]));

		 		$(elements[i]).css('transform','translate3d( '+ systemProperties.x_from +'px,' + systemProperties.y_from + 'px ,0px)');
			}
		}
	}

	function getScrollAnimationProperties(element) {
	    var elementProperties = element.data("js-scroll-animation"),
            x_from = elementProperties.translateFrom.large[0],
            y_from = elementProperties.translateFrom.large[1],
            x_to = elementProperties.translateTo.large[0],
            y_to = elementProperties.translateTo.large[1];

		return {
			x_from:x_from, 
			y_from:y_from, 
			x_to:x_to, 
			y_to:y_to
		};
	}

	function Utils() {

	}

	Utils.prototype = {
	    constructor: Utils,
	    isElementInView: function (element, fullyInView) {
	        var pageTop = $(window).scrollTop(),
                pageBottom = pageTop + $(window).height(),
                elementTop = $(element).offset().top,
                elementBottom = elementTop + $(element).height(),
                scrollAmount = getScrollAmount(element);

	        // Calculate the scroll ration of the element
			var ratio = (scrollAmount.y_from + (((pageBottom - elementTop) * scrollAmount.amount) * scrollAmount.modifier));

	        if (fullyInView === true) {
	            return {
	            	visible:((pageTop < elementTop) && (pageBottom > elementBottom)),
	            	ratio:ratio
	            };
	        } else {
	            return {
	            	visible:((elementTop <= pageBottom) && (elementBottom >= pageTop)),
	            	ratio:ratio
	            };
	        }
	    }
	};

	var Utils = new Utils();

	function getScrollAmount(element) {
		var properties = getScrollAnimationProperties(element),
		    y = [properties.y_from, properties.y_to],
	      elementTop = $(element).offset().top,
	      elementBottom = elementTop + $(element).height(),
		    elementHeight = elementBottom - elementTop,
		    windowHeight = $(window).height();


		// Get amount betweent y_from and y_to properties
		// Example: 
		//					y_from = -50;
		//  				y_to = 60;
		// 
		//  Output: 110
		y.sort();
		var yDistance = y[1] - y[0];

		// Calculates the amount to add for every pixel scrolled
		// Example: 
		//					yDistance = 110;
		//  				elementHeight = 200;
		// 
		//  Output: 0.55
		var amount = yDistance / (elementHeight + windowHeight);

		if ((properties.y_from < 0 && properties.y_to < 0) || (properties.y_from > 0 && properties.y_to > 0)) {
			var modifier = 1
		} else {
			var modifier = (properties.y_from > properties.y_to) ? -1 : 1
		}

		return {amount:amount, modifier:modifier, y_from:properties.y_from};

	}

	function scrollAnimation() {
		if (elements != null) {
			for (var i = elements.length - 1; i >= 0; i--) {
		 		var systemInView = Utils.isElementInView($(elements[i]), false);

		 		if (systemInView.visible) {
					$(elements[i]).css('transform','translate3d( 0px,' + parseInt(systemInView.ratio) + 'px ,0px)');
				}
			}
		}
	}