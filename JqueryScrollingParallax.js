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
//   data-js-scroll-animation='{"translateFrom":{"large":[0, 100],"medium":[0, 80],"small":[0, 0],"xsmall":[0, 0]},"translateTo":{"large":[0, -300],"medium":[0, -200],"small":[0, -200],"xsmall":[0, -200]}}'

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

            $(elements[i]).css('transform', 'translate3d( ' + systemProperties.x_from + 'px,' + systemProperties.y_from + 'px ,0px)');
        }
    }
}

function getScrollAnimationProperties(element) {
  var elementProperties = element.data("js-scroll-animation"),
      width = $(window).width();

  $(window).on('resize', function () {
      width = $(window).width();
  });

  if (width >= 1280) {
    x_from = elementProperties.translateFrom.large[0],
    y_from = elementProperties.translateFrom.large[1],
    x_to = elementProperties.translateTo.large[0],
    y_to = elementProperties.translateTo.large[1];
  } else if (width >= 992) {
    x_from = elementProperties.translateFrom.medium[0],
    y_from = elementProperties.translateFrom.medium[1],
    x_to = elementProperties.translateTo.medium[0],
    y_to = elementProperties.translateTo.medium[1];
  } else if (width >= 768) {
    x_from = elementProperties.translateFrom.small[0],
    y_from = elementProperties.translateFrom.small[1],
    x_to = elementProperties.translateTo.small[0],
    y_to = elementProperties.translateTo.small[1];
  } else if (width < 768) {
    x_from = elementProperties.translateFrom.xsmall[0],
    y_from = elementProperties.translateFrom.xsmall[1],
    x_to = elementProperties.translateTo.xsmall[0],
    y_to = elementProperties.translateTo.xsmall[1];
  }

  return {
      x_from: x_from,
      y_from: y_from,
      x_to: x_to,
      y_to: y_to
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
        var yratio = (scrollAmount.y_from + (((pageBottom - elementTop) * scrollAmount.yamount) * scrollAmount.ymodifier));
        var xratio = (scrollAmount.x_from + (((pageBottom - elementTop) * scrollAmount.xamount) * scrollAmount.xmodifier));

        if (fullyInView === true) {
            return {
                visible: ((pageTop < elementTop) && (pageBottom > elementBottom)),
                yratio: yratio,
                xratio: xratio
            };
        } else {
            return {
                visible: ((elementTop <= pageBottom) && (elementBottom >= pageTop)),
                yratio: yratio,
                xratio: xratio
            };
        }
    }
};

var Utils = new Utils();

function getScrollAmount(element) {
    var properties = getScrollAnimationProperties(element),
    y = [properties.y_from, properties.y_to],
    x = [properties.x_from, properties.x_to],
    elementTop = $(element).offset().top,
    elementBottom = elementTop + $(element).height(),
    elementHeight = elementBottom - elementTop,
    windowHeight = $(window).height();


    // Get amount between y_from and y_to properties
    // Example: 
    //          y_from = -50;
    //          y_to = 60;
    // 
    //  Output: 110
    y.sort();
    var yDistance = y[1] - y[0];

    // Get amount between x_from and x_to properties
    // Example: 
    //          x_from = -50;
    //          x_to = 60;
    // 
    //  Output: 110
    x.sort();
    var xDistance = x[1] - x[0];

    // Calculates the amount to add for every pixel scrolled
    // Example: 
    //          yDistance = 110;
    //          elementHeight = 200;
    // 
    //  Output: 0.55
    var yamount = yDistance / (elementHeight + windowHeight);

    // Calculates the amount to add for every pixel scrolled
    // Example: 
    //          xDistance = 110;
    //          elementHeight = 200;
    // 
    //  Output: 0.55
    var xamount = xDistance / (elementHeight + windowHeight);

    if ((properties.y_from < 0 && properties.y_to < 0 && properties.y_from < properties.y_to) || (properties.y_from > 0 && properties.y_to > 0 && properties.y_from < properties.y_to)) {
        var ymodifier = 1
    } else if ((properties.y_from < 0 && properties.y_to < 0 && properties.y_from > properties.y_to) || (properties.y_from > 0 && properties.y_to > 0 && properties.y_from > properties.y_to)) {
        var ymodifier = -1
    } else {
        var ymodifier = (properties.y_from > properties.y_to) ? -1 : 1
    }

    if ((properties.x_from < 0 && properties.x_to < 0 && properties.x_from < properties.x_to) || (properties.x_from > 0 && properties.x_to > 0 && properties.x_from < properties.x_to)) {
        var xmodifier = 1
    } else if ((properties.x_from < 0 && properties.x_to < 0 && properties.x_from > properties.x_to) || (properties.x_from > 0 && properties.x_to > 0 && properties.x_from > properties.x_to)) {
        var xmodifier = -1
    } else {
        var xmodifier = (properties.x_from > properties.x_to) ? -1 : 1
    }

    return { yamount: yamount, ymodifier: ymodifier, y_from: properties.y_from, xamount: xamount, xmodifier: xmodifier, x_from: properties.x_from };

}

function scrollAnimation() {
    if (elements != null) {
        for (var i = elements.length - 1; i >= 0; i--) {
            var systemInView = Utils.isElementInView($(elements[i]), false);

            if (systemInView.visible) {
                $(elements[i]).css('transform', 'translate3d(' + parseInt(systemInView.xratio) +'px,' + parseInt(systemInView.yratio) + 'px ,0px)');
            }
        }
    }
}