# Stubble

**NB! Stubble is not ready for consumption just yet.**

*Tiny hairy templates, with potential.*

Stubble is a ***552 byte*** (gzipped) template system. It has a few areas of focus:

* Staying tiny
* Keep the markup clean & separate from logic
* Easily expandable (using filters)

It is far from a slick [handlebar mustache](http://handlebarsjs.com/), but you can easily grow it however you want.

## Basics

### Defining templates

Put the data stub's somewhere in your dom.

    <div data-stub="login">
        <span>Welcome {{user}}!</span>
    </div>

### Rendering templates

Calling stub.load() will collect all your stubs and remove them from the dom.

	stub.load()
	var login = stub('login',{'user':'Bob'})
	==>
	<div>
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

* Write more tests
* Finish documentation
* Support loading templates async?
    * stubble.load('path/to/file.html')
    * stubble.load('path/to/folder')
    * ?? jade syntax ??
enojy.
