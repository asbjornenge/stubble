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
        })

        it('Should have some specific properties', function() {
            createStub('user', 'Hi there {{user@filterA}})')
            stubble.filters['filterA'] = function(data) {
                expect(data).to.have.property('extracted');
                expect(data).to.have.property('expr');
                expect(data).to.have.property('obj');
                expect(data).to.have.property('node');
            }
            stubble.load();
            var template = stubble('user', { user : 'asbjornenge' });
            delete stubble.filters['filterA'];
        })

        // verify filter data object (and it's properties)

        // default filters
        // custom filter
        // replacing a filter

        // test databind example ?

    })


  }
})
