define([
  'intern!bdd',
  'intern/chai!expect',
  'lib/stubble',
  'lib/databind',
], function (bdd, expect, stubble, databind) {
    with(bdd) {

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

        describe('The databind plugin', function() {
            it('Should be possible to implement databind', function() {
                var data = { username : 'asbjorn' }

                createDataBindForm('databind');
                stubble.load();

                var template = stubble('databind', data);

                expect(template.children[0].value).to.equal('asbjorn');
                template.children[0].setAttribute('value','elisabeth');
                template.children[0].onchange();
                expect(data.username).to.equal('elisabeth');

                stubble.templates = {}
            })
        })
    }
})
