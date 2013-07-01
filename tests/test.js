/**
 * stubble
 *
 *    Library test
 */

define([
  'intern!bdd',
  'intern/chai!expect',
  'lib/stubble_amd',
], function (bdd, expect, stubble) {
  with(bdd) {

    describe('Basics', function() {
      it('Library should be a function!', function() {
        expect(stubble).to.be.a('function');
      })
    })

  }
})
