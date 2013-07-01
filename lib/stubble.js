/**
 * Stubble
 * -------
 * Tiny Hairy templates
 *
 * Web     : http://asbjornenge.com/stubble
 * Author  : @asbjornenge
 * License : MIT
 **/


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // Register AMD module
        define([], factory);
    } else {
        // Browser global
        root.stubble = factory();
    }
}(this, function () {

    var stub = function render(name, obj) {
        if (!stub.templates.hasOwnProperty(name)) {return;}
        var tmp   = $(stub.templates[name]).clone();
        var items = tmp[0].getElementsByTagName("*");
        for (var i = items.length; i--;) {
            stub.handle_attributes(items[i],obj);
            stub.handle_textnodes(items[i],obj);
        }
        stub.handle_attributes(tmp[0],obj);
        stub.handle_textnodes(tmp[0],obj);
        return tmp;
    };

    /* PROPERTIES
     *------------------------------ */

    stub.reg = new RegExp("{{(.*?)}}","g");
    stub.templates = {};

    /* EVENTS
     *------------------------------ */

    stub.events = {};
    stub.events.init = function() {
        var databind = document.createEvent('HTMLEvents');
        databind.initEvent('databind', false, false);
        stub.events['databind'] = databind;
    };
    stub.events.init();

    /* FILTERS
     *------------------------------ */

    stub.filters = {
        extract  : function(data) {
            data.extracted = stub.extract(data.obj,data.prop);
        },
        _null     : function(data) {
            if (data.extracted == null) {data.extracted = '';}
        },
        _undef    : function(data) {
            if (data.extracted === undefined) {data.extracted = '';}
        },
        replace  : function(data) {
            if (data.type === 'attribute') {
                var attr = data.node.attributes[data.attribute];
                attr.value = attr.value.replace(data.expr,data.extracted);
            }
            if (data.type === 'text') {
                var child = data.child;
                child.textContent = child.textContent.replace(data.expr,data.extracted);
            }
        },
        'default' : '@_null@_undef'
    };

    /* MATCHER
     *------------------------------ */

    stub.match = function(str) {
        var m = str.match(stub.reg);
        if (m == null || m.length === 0) {return;}
        var matches = [];
        for (var i=m.length; i--;) {
            var match   = {filters:[],expr:m[i]};
            var filters = [];
            var expr  = m[i].slice(2,-2).split('@');
            for (var j=expr.length; j--;) {
                if (j === 0) {match['prop'] = expr[j];}
                else {filters.push(expr[j]);}
            }
            filters = stub.filters['default'].split('@').concat(filters);
            for (var k=filters.length; k--;) {
                if (stub.filters[filters[k]] !== undefined) {match.filters.push(stub.filters[filters[k]]);}
            }
            match.filters.reverse();
            matches.push(match);
        }
        return matches;
    };

    /* ATTRIBUTE HANDLER
     *------------------------------ */

    stub.handle_attributes = function(node, obj) {
        var attributes = node.attributes;
        for (var j=attributes.length; j--;) {
            var matches = stub.match(attributes[j].value);
            if (!matches || matches.length === 0) {continue;}
            for (var k=matches.length;k--;) {
                var data = {
                    node : node,
                    obj  : obj,
                    prop : matches[k].prop,
                    expr : matches[k].expr,
                    type : 'attribute',
                    attribute : attributes[j].name
                };
                stub.filters.extract(data);
                for (var f in matches[k].filters) {
                    matches[k].filters[f](data);
                }
                stub.filters.replace(data);
            }
        }
    };

    /* TEXTNODE HANDLER
     *------------------------------ */

    stub.handle_textnodes = function(node, obj) {
        var childNodes = node.childNodes;
        for (var j=childNodes.length; j--;) {
            var child = childNodes[j];
            if (child.nodeType === 3) {
                var matches = stub.match(child.textContent);
                if (!matches || matches.length === 0) {continue;}
                for (var k=matches.length;k--;) {
                    var data = {
                        node : node,
                        obj  : obj,
                        prop : matches[k].prop,
                        expr : matches[k].expr,
                        type : 'text',
                        child : child
                    };
                    stub.filters.extract(data);
                    for (var f in matches[k].filters) {
                        matches[k].filters[f](data);
                    }
                    stub.filters.replace(data);
                }
            }
        }
    };

    /* LOADER
     *------------------------------ */

    stub.load = function() {
        var nodeList = document.getElementsByTagName('*');
        var nodeArray = [];
        for (var i=0, elem; elem = nodeList[i]; i++) {
            var ds = elem.getAttribute('data-stub');
            if (ds) {
                stub.templates[ds] = elem;
                elem.parentNode.removeChild(elem);
            }
        }
        return nodeArray;
    };

    /* EXTRACTOR
     *------------------------------ */

    stub.extract = function(obj,expr,val) {
        var o = obj;
        var a = expr.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '').split('.');
        var p, n;
        while (a.length) {
            n = a.shift();
            if (n in o) {
                p = o;
                o = o[n];
            } else {
                return;
            }
        }
        if (val !== undefined && typeof(p) === 'object') {p[n] = val;}
        return o;
    };

    return stub;
}));
