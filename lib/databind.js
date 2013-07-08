/**
 * Stubble
 * -------
 * Simple databind plugin
 *
 * Web     : http://asbjornenge.com/stubble
 * Author  : @asbjornenge
 * License : MIT
 *------------------------------------------------*/


(function (root, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register AMD module
        define(['lib/stubble'], factory);
    } else {
        // Browser global
        root.stubble = factory(stubble);
    }
}(this, function (stubble) {
    'use strict';

    stubble.filters.databind = function (data) {

        if (data.type === 'attribute' && data.node.nodeName === 'INPUT' && data.attribute === 'value') {
            data.node.onchange = function () {
                data.obj[data.prop] = this.value;
            };
        }

    };

}));
