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

    function createStub(name) {
        var template = document.createElement("div");
        template.id = name;
        template.setAttribute('data-stub',name);
        var content = document.createTextNode("Hi there {{username}}, and greetings!");
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
            createStub('user');
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
        })
    })


    // TEST
    //    different property injections obj.prop, obj[prop]
    //    @filters
    //    sub-templates are loaded & handled correctly

  }
})
