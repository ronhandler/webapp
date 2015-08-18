// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.
//

/**
 * JS Library v0
 */

var UTILS = (function () {

	return {
		/**
		 * Check if a given value is a plain Object
		 *
		 * @param  {*}       o Any value to be checked
		 * @return {Boolean}   true if it's an Object
		 */
		isObject: function(o) {
			var toString = Object.prototype.toString;
			return (toString.call(o) === toString.call({}));
		},
		/**
		 * Test function. Alerts the user with "Hi" message.
		 */
		sayHi: function() {
			window.alert('Hi');
		},
		/**
		 * Cross-browser add/remove event listeners.
		 */
		addEvent: function(elem, type, handler) {
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent)  {
				elem.attachEvent('on'+type, handler);
			}
		},
		removeEvent: function(elem, type, handler) {
			if (elem.removeEventListener) {
				elem.removeEventListener(type, handler, false);
			} else if (elem.detachEvent)  {
				elem.detachEvent('on'+type, handler);
			}
		},
	};
}());

