/**
 * Stubble
 * -------
 * Tiny Hairy templates
 *
 * Web     : http://asbjornenge.com/stubble
 * Author  : @asbjornenge
 * License : MIT
 **/

var stub = function render(name, obj) {
	if (!stub.templates.hasOwnProperty(name)) return;
	var tmp   = $(stub.templates[name]).clone()
	items = tmp[0].getElementsByTagName("*");
	for (var i = items.length; i--;) {  
	    stub.handle_attributes(items[i],obj);
	    stub.handle_textnodes(items[i],obj);
	}
	stub.handle_attributes(tmp[0],obj);
	stub.handle_textnodes(tmp[0],obj);
	return tmp;
}

/* PROPERTIES
 *------------------------------ */

stub.reg = /{{(.*?)}}/g
stub.templates = {};

/* EVENTS
 *------------------------------ */

stub.events = {}
stub.events.init = function() {
	var databind = document.createEvent('HTMLEvents');
    databind.initEvent('databind', false, false);
    stub.events['databind'] = databind;
}
stub.events.init();

/* FILTERS 
 *------------------------------ */

stub.filters = {
	extract  : function(data) {
		data.extracted = stub.engine.eval(data.obj,data.prop);
	},
	null     : function(data) {
		if (data.extracted == null) data.extracted = '';
	},
	undef    : function(data) {
		if (data.extracted == undefined) data.extracted = '';
	},
	databind : function(data) {
		if (data.type != 'attribute') {
			if (typeof(console) == 'object') console.log("Databind only supported for attributes");
			return;
		}
		data.node.addEventListener('change', function() {
			data.extracted = this.value;
			data.node.dispatchEvent(stub.events.databind);
			stub.engine.eval(data.obj,data.prop,data.extracted);
		})
	},
	replace  : function(data) {
		if (data.type == 'attribute') {
			var attr = data.node.attributes[data.attribute];
			attr.value = attr.value.replace(data.expr,data.extracted);
		}
		if (data.type == 'text') {
			var child = data.child;
			child.textContent = child.textContent.replace(data.expr,data.extracted);
		}
	},
	'default' : '@null@undef'
}

/* MATCHER 
 *------------------------------ */

stub.match = function(str) {
	var m = str.match(stub.reg)
	if (m == null || m.length == 0) return;
	var matches = []
	for (var i=m.length; i--;) {
		var match   = {filters:[],expr:m[i]}
		var filters = []
		var expr  = m[i].slice(2,-2).split('@')
		for (var j=expr.length; j--;) {
			if (j == 0) match['prop'] = expr[j]
			else filters.push(expr[j])
		}
		filters = stub.filters['default'].split('@').concat(filters)
		for (var k=filters.length; k--;) {
			if (stub.filters[filters[k]] != undefined) match.filters.push(stub.filters[filters[k]])
		}
		match.filters.reverse()
		matches.push(match)
	}
	return matches;
}

/* ATTRIBUTE HANDLER
 *------------------------------ */

stub.handle_attributes = function(node, obj) {
	var attributes = node.attributes;
	for (var j=attributes.length; j--;) {
		var matches = stub.match(attributes[j].value)
		if (!matches || matches.length == 0) continue;
		for (var k=matches.length;k--;) {
			var data = {
				node : node,
				obj  : obj,
				prop : matches[k].prop,
				expr : matches[k].expr,
				type : 'attribute',
				attribute : attributes[j].name
			}
			stub.filters.extract(data);
			for (var f in matches[k].filters) {
				matches[k].filters[f](data);
			}
			stub.filters.replace(data);
		}
	}
}

/* TEXTNODE HANDLER
 *------------------------------ */

stub.handle_textnodes = function(node, obj) {
	var childNodes = node.childNodes;
	for (var j=childNodes.length; j--;) {
		var child = childNodes[j];
		if (child.nodeType == 3) {
			var matches = stub.match(child.textContent)
			if (!matches || matches.length == 0) continue;
			for (var k=matches.length;k--;) {
				var data = {
					node : node,
					obj  : obj,
					prop : matches[k].prop,
					expr : matches[k].expr,
					type : 'text',
					child : child
				}
				stub.filters.extract(data);
				for (var f in matches[k].filters) {
					matches[k].filters[f](data);
				}
				stub.filters.replace(data);
			}
		}
	}
}

/* LOADER
 *------------------------------ */

stub.load = function() {
	$('[template]').each(function(i,t) {
		var tp = $(t);
		var id = tp.attr('template');
		tp.removeAttr('template');
		stub.templates[id] = tp[0];
		$(t).remove();
	})
}

/* EVAL ENGINE
 *------------------------------ */

stub.engine = {}
stub.engine.eval = function(obj,expr,val) {
	o = obj;
    s = expr.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = expr.replace(/^\./, '');           // strip a leading dot
    var a = expr.split('.');
    var p;
    while (a.length) {
        var n = a.shift();
        if (n in o) {
        	p = o;
            o = o[n];
        } else {
            return;
        }
    }
    if (val != undefined && typeof(p) == 'object') p[n] = val;
    return o;
}


