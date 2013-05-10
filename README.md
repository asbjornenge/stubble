# Stubble

**NB! Stubble is not ready for consumption just yet.**

*Tiny hairy templates, with potential.*

Stubble is a ***142 byte*** template system. It has a few areas of focus:

* Staying tiny
* Keep the markup clean & separate from logic
* Easily expandable (using filters)

It is far from a slick [handlebar mustache](http://handlebarsjs.com/), but you can easily grow it however you want.

## Basics

### Defining templates

    <div stub="login" id="login" class="login">
        <span>Welcome {{user}}!</span>
    </div>

### Rendering templates

	stub.load()
	var login = stub('login',{'user':'Bob'})
	==>
	<div id="login" class="login">
        <span>Welcome Bob!</span>
    </div>

## Filters

…more on this later…

### Validation

### Databind

### Two-way databind

### Other useful examples

* Update sibling?
* Loops?

## Install

…bower support coming soon… don't use it for now :-P

## Use

	<script src="components/stubble/stubble.min.js"></script>

## TODO

* Remove prepacked databind support
* Write more tests
* Finish documentation

enojy.