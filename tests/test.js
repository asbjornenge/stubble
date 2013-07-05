/**
 * stubble
 *
 *    Library test
 */

define([
  'intern!bdd',
  'intern/chai!expect',
  'lib/stubble',
], function (bdd, expect, stubble) {
  with(bdd) {

    function createStub(name, textContent) {
        var template = document.createElement("div");
        template.id = name;
        template.setAttribute('class','{{classes}}')
        template.setAttribute('data-stub',name);
        var content = document.createTextNode(textContent);
        template.appendChild(content);
        document.body.appendChild(template);
        return template;
    }

    function createDataBindForm(name) {
        var template = document.createElement("div");
        template.id = name;
        template.setAttribute('data-stub',name);
        var content = document.createTextNode("Hi {{username@databind}}!");
        var input   = document.createElement("input");
        input.type  = 'text';
        input.setAttribute('value', '{{username@databind}}');
        template.appendChild(content);
        template.appendChild(input);
        document.body.appendChild(template);
        return template;
    }

    describe('Basics', function() {
        it('Library should be a function!', function() {
            expect(stubble).to.be.a('function');
        })

        it('Should have some properties and functions', function() {
            expect(stubble.load).to.be.a('function');
            expect(stubble.templates).to.be.a('object');
        })
    })

    describe('Loading templates', function() {
        it('Should collect and remove from dom, elements with data-stub attribtues', function() {
            createStub('user');
            expect(document.getElementById('user')).to.be.a('object');
            stubble.load();
            expect(stubble.templates).to.have.property('user');
            expect(document.getElementById('user')).to.be.a('null');
            stubble.templates = {}
        })

        it('Should return a dom element when called', function() {
            var _template = createStub('user');
            stubble.load();
            var template  = stubble('user');
            expect(template).to.deep.equal(_template);
            stubble.templates = {}
        })

        it('Should inject data from passed object', function() {
            createStub('user', "Hi there {{username}}, and greetings!");
            stubble.load();
            var template = stubble('user', { username : 'asbjornenge' });
            var index    = template.firstChild.nodeValue.indexOf('asbjornenge');
            expect(index).to.be.above(-1);
            stubble.templates = {}
        })

        it('Should extract nested stubs individually', function() {
            var parent = createStub('users');
            var child  = createStub('user');
            parent.appendChild(child);
            stubble.load();
            expect(stubble.templates).to.have.property('users');
            expect(stubble.templates).to.have.property('user');
            stubble.templates = {}
        })
    })

    describe('Extracting & replace data', function() {
        it('Should allow extracting properties via . selector', function() {
            createStub('user', "Hi there {{user.name}}, and greetings!");
            stubble.load();
            var template = stubble('user', { user : { name : 'asbjornenge' } });
            var index    = template.firstChild.nodeValue.indexOf('asbjornenge');
            expect(index).to.be.above(-1);
            stubble.templates = {}
        })

        it('Should allow extracting properties via [] selector', function() {
            createStub('user', "Hi there {{user[name]}}, and greetings!");
            stubble.load();
            var template = stubble('user', { user : { name : 'asbjornenge' } });
            var index    = template.firstChild.nodeValue.indexOf('asbjornenge');
            expect(index).to.be.above(-1);
            stubble.templates = {}
        })

        describe('Nested properties', function() {
            var nestedData = {
                user : {
                    name : {
                        first : 'asbjorn',
                        last  :  'enge'
                    },
                    nicks : ['asbjornenge','meh']
                }
            }
            var testNested = function(content, expected, data) {
                createStub('user', content);
                stubble.load();
                var template = stubble('user', data);
                var index    = template.firstChild.nodeValue.indexOf(expected);
                expect(index).to.be.above(-1);
                stubble.templates = {}
                return template;
            }

            it('Should allow extracting nested properties using . selector', function() {
                testNested("Hi there {{user.name.first}}, and greetings!", "asbjorn", nestedData);
            })
            it('Should allow extracting nested properties using [] selector', function() {
                testNested("Hi there {{user[name][first]}}, and greetings!", "asbjorn", nestedData);
            })
            it('Should allow extracting values from arrays', function() {
                testNested("Hi there {{user[nicks][0]}}, and greetings!", "asbjornenge", nestedData);
                testNested("Hi there {{user.nicks[1]}}, and greetings!", "meh", nestedData);
            })
        })

        describe('Attributes', function() {
            it('Should also replace attributes', function() {
                createStub('user');
                stubble.load();
                var template = stubble('user', { classes : 'class1' })
                var classes  = template.getAttribute('class');
                expect(classes.indexOf('class1')).to.be.above(-1);
                stubble.templates = {}
            })
        })
    })

    describe('Filters', function() {
        it('Should pass filter data through defined filters', function() {
            createStub('user', 'Hi there {{user@filterA}}!')
            stubble.filters['filterA'] = function(data) {
                data['extracted'] = 'yolo';
            }
            stubble.load();
            var template = stubble('user', { user : 'asbjornenge' });
            var index    = template.firstChild.nodeValue.indexOf('yolo');
            expect(index).to.be.above(-1);
            delete stubble.filters['filterA'];
            stubble.templates = {}
        })

        it('Should have some specific properties', function() {
            createStub('user', 'Hi there {{user@filterA}})')
            stubble.filters['filterA'] = function(data) {
                expect(data).to.have.property('extracted');
                expect(data).to.have.property('expr');
                expect(data).to.have.property('obj');
                expect(data).to.have.property('node');
                expect(data.node.id).to.equal('user');
            }
            stubble.load();
            var template = stubble('user', { user : 'asbjornenge' });
            delete stubble.filters['filterA'];
            stubble.templates = {}
        })

        it('Should default turn undefined & nulls into empty strings', function() {
            createStub('user', 'Hi there {{userA}} and {{userB}}')
            stubble.load();
            var template = stubble('user', { userA : null });
            var nodeVal = template.firstChild.nodeValue;
            expect(nodeVal.indexOf('null')).to.be.below(0);
            expect(nodeVal.indexOf('undefined')).to.be.below(0);
            stubble.templates = {}
        })

        it('Should allow replacement of filters', function() {
            createStub('user', 'Hi there {{userA}} and {{userB}}')
            var old_null = stubble.filters['_null'];
            stubble.filters['_null'] = function(data) {}
            stubble.load();
            var template = stubble('user', { userA : null });
            var nodeVal = template.firstChild.nodeValue;
            expect(nodeVal.indexOf('null')).to.be.above(0);
            expect(nodeVal.indexOf('undefined')).to.be.below(0);
            stubble.templates = {}
            stubble.filters['_null'] = old_null;
        })


        // DONE - verify filter data object (and it's properties)

        // DONE - default filters
        // DONE - custom filter
        // DONE - replacing a filter

        // test databind example ?

        it('Should be possible to implement databind', function() {
            var data = {
                username : 'asbjorn',
            }
            var dbevent = new CustomEvent('dataBindEvent');

            createDataBindForm('databind');
            stubble.load();

            stubble.filters.databind = function(data) {
                // TODO: Do better!
                switch(data.node.nodeName) {
                    case 'INPUT':
                        data.node.onchange = function() {
                            data.obj[data.prop] = this.value;
                            this.dispatchEvent(dbevent);
                        }
                        data.node.addEventListener('dataBindEvent', function(e) {
                            this.value = data.obj[data.prop];
                        }, false)
                        break;
                    case 'DIV':
                        data.orig = data.child.nodeValue;
                        data.node.children[0].addEventListener('dataBindEvent', function(e) {
                            data.child.textContent = data.orig;
                            data.extracted = data.obj[data.prop];
                            stubble.filters.replace(data);
                        }, false);
                }
            }

            var template = stubble('databind', data);

            template.children[0].setAttribute('value','elisabeth');
            template.children[0].onchange();
            expect(data.username).to.equal('elisabeth');
            var nodeVal = template.firstChild.nodeValue;
            expect(nodeVal.indexOf('elisabeth')).to.be.above(0);

            data.username = 'eplekake';
            template.children[0].dispatchEvent(dbevent);
            expect(template.children[0].value).to.equal('eplekake');
            var nodeVal = template.firstChild.nodeValue;
            expect(nodeVal.indexOf('eplekake')).to.be.above(0);

            stubble.templates = {}
        })
    })

    // TODO: Test including filters as a plugin?
    // Put databind in a separate test module and pull the filter as plugin.

  }
})
