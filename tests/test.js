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
        })
    })

  }
})
