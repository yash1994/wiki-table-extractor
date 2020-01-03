var assert = require('assert')
var TableExtractor = require("./index.js")

describe("Table Extraction", function(){
    it('Extracts', (done) => {
        TableExtractor("https://en.wikipedia.org/wiki/Anya_Chalotra").then( (result) => {
          assert.equal(result[0][0], {
            Year: '2018',
            Title: 'Wanderlust',
            Role: 'Jennifer Ashman',
            Notes: '5 episodes'
          });
        }).finally(done);
      });
});