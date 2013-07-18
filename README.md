# Stubble

*Tiny hairy templates, with potential.*

Stubble is a ***552 B*** (gzipped) template system. It has a few areas of focus:

* Staying tiny
* Keep the markup clean & separate from logic
* Easily expandable (using filters)

It is far from a slick [handlebar mustache](http://handlebarsjs.com/), but you can easily grow it however you want.

## Installation

	bower install stubble
	
## Usage

	<script src="bower_components/stubble/stubble.min.js"></script>

## Basics

### Defining templates

Put the data stub's somewhere in your dom.

    <div data-stub="login">
        <span>Welcome {{user}}!</span>
    </div>

### Rendering templates

Calling **stub.load()** will collect all your stubs and remove them from the dom.

	stub.load()
	var login = stub('login', {'user' : 'Bob'})
	// =>
	// <div>
	//   <span>Welcome Bob!</span>
	// </div>
	
## Filters

Filters are a way of expanding stubbles capabilities in a declarative manner. By adding a filter function to **stub.filters** and tagging a property with **@filtername**. Stubble will upon initialization pass a [special object](#filter-data) through this filter function.

	<div data-stub="inputs">
		<input type="number" value="{{amount@updateSum}}" />
		<div class="sum"></div>
	</div>

The filter might look like this (if you had jQuery up your sleve):

	stub.filters.updateSum = function(data) {
		$(data.node).on('change', function() {
			$(this).next().text(150 * this.value);
		})
	}

### <a name="filter-data">Filter data</a>

The data object that is passed through the filters consist of the following.

	{
		node : <dom>,    // the stub node
		obj  : {},       // the data object passed to stub
		prop : <string>, // the matched obj property extracted
		expr : <string>, // the matched expression
		type : <string>, // 'attribute' or 'text'
		attribute : <string>, // only if type is attribute - attribute name
		child     : <string>, // only if type is text - text node
		extracted : ?         // extracted value
	}

### Filter nesting

	<div data-stub="inputs">
		<input type="number" value="{{amount@removeCommas@updateSum@updateEmailText@databind}}" />
		<div class="sum"></div>
	</div>

### Filter order

It is important to note that filters are processed in the order specified in the template.

### Extract filter

*stub.filters.extract* is special. It is always the **first** to run and is responsible for extracting the correct value form the passed object as specified by the expression.

### Replace

*stub.filters.replace* is special also. It is always the **last** filter to run. It replaces the content of *data.expr* with that of *data.extracted*.

### Default

There is also a *stub.filters.default* property where you can specify filters to run on **all** stubs.

Stubble comes with two builtin filters; *_null* and *_undef*. These are by default the default. If any extracted value results to null or undefined these two filters will replace *data.extracted* with an empty string.

### Filter examples

#### Formatting

Markup

	<div data-stub="inputs">
		<input type="date" value="{{date@formatDate}}" />
	</div>

Filter

	stub.filters.formatDate = function(data) {
		data.extracted = format(data.extracted);
	}

#### Required fields

Markup

	<div data-stub="inputs">
		<input type="number" value="{{prop1@required}}" />
		<input type="text"   value="{{prop2@required}}" />
		<input type="date"   value="{{prop3@required}}" />
	</div>

Filter

	stub.filters.required = function(data) {
		$(data.node).on('validate', function() {
			if (this.value == "") $(this).addClass('invalid');
		})
	}

#### Databind

Markup

	<div data-stub="inputs">
		<input type="number" value="{{prop1@databind}}" />
	</div>

Filter

	stub.filters.databind = function(data) {
		$(data.node).on('change', function() {
			data.obj[data.prop] = this.value;
		})
	}

If you make any useful generic filters, please drop me a link <a href="http://twitter.com/asbjornenge">@asbjornenge</a>.

enojy.
