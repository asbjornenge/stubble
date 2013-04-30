# Stubble

*Tiny hairy templates*

## Install

	bower install stubble --save

## Use

	<script src="components/stubble/stubble.min.js"></script>


### Defining templates

    <div template="login" id="login" class="login">
        <span>Welcome {{user}}!</span>
    </div>

### Rendering templates

	stub.load()
	var login = stub('login',{'user':'Bob'})
	==>
	<div id="login" class="login">
        <span>Welcome Bob!</span>
    </div>

enojy.