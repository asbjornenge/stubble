/**
 * Stubble
 * -------
 * Tests
 *
 * Web     : http://asbjornenge.com/stubble
 * Author  : @asbjornenge
 * License : MIT
 **/

stub.load()

module("Basic")

test("Replace text", function() {
	var t = stub('text', {text:"My text"})
	equal(t.text(), "My text")
});

test("Replace attribute", function() {
	var t = stub('attribute', {value:"Some value"})
	equal(t.find('input').val(), "Some value")
});

// TODO
test("Replace html", function() {
  ok( 1 == "1", "Passed!" );
});

test("Filters", function() {
	var time = new Date().getTime();
	var correct = new Date().toJSON().slice(0,10)

	stub.filters['fixdate'] = function(data) {
		data.extracted = correct
	}

	var t = stub('filters', {value:time})
	notEqual(t.find('input:first').val(), correct)
	equal(t.find('input:last').val(), correct)

	delete stub.filters['fixdate']
});

module("Databind")

var change = document.createEvent('HTMLEvents');
change.initEvent('change', false, false);

test("Databind", function() {
	var obj = {
		name  : "Asbjorn",
		drink : "Coffee"
	}
	var t = stub('databind', obj);
	t.find('input').val("Pourover by Chemex Coffee");
	t.find('input')[0].dispatchEvent(change);
	equal(obj.drink, "Pourover by Chemex Coffee");
});

asyncTest("Databind event", function() {
	var correct   = new Date().getTime();
	var formatted = new Date(correct).toJSON().slice(0,10)
	var obj = {
		name  : "Asbjorn",
		drink : "Coffee",
		date  : new Date("2010-01-01")
	}
	
	stub.filters['fixdate'] = function(data) {
		data.node.addEventListener('databind', function() {
			data.extracted = correct
		})
	}

	var t = stub('databind_event', obj);
	t.find('input:first').val("Pourover by Chemex Coffee");
	t.find('input:first')[0].dispatchEvent(change);
	equal(obj.drink, "Pourover by Chemex Coffee");

	setTimeout(function() {
		t.find('input:last').val(formatted);
		t.find('input:last')[0].dispatchEvent(change);
		equal(obj.date, correct)
		start()	
	},10)
});



