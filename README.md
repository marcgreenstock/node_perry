Perry
===

Multi-dimensional query string parser and generator.

Install:

    npm install perry

Perry.stringify usage:

    var perry = require('perry');
    var string = perry.stringify({
      foo: {
        first: {
          second: {
            third: 'bar'
          },
          another: [23,42]
        }
      }
    });

Result:

    foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42

Perry.parse usage:    

    var obj = perry.parse('foo[0][bar][0]=meh&foo[0][bar][1]=beh&foo[1][bar][0]=teh');
    
Result:

    {
      foo: [{
        bar: ['meh','beh']
      },{
        bar: ['teh']
      }]
    }
    
Perrry.parse a query string with empty braces will create an index array beginning with 0:

    perry.parse('foo[]=bar&foo[]=mah');

result:
    
    {
      foo: ['bar','meh']
    }

Perry.parse a query strings with a numerical index will associate an array with identical indexes:

    perry.parse('foo[0]=bar&foo[2]=mah');
    
Result: 
    
    {
      foo: ['bar',undefined,'mah]
    }
    
Notice the undefined at index 1, this is to keep the array indexes consistant since foo[1] isn't present in the query string. The alternative would be to create a numerically indexed object which may not be expected bahaviour considering an array is expected.

Test:

    node test/test-perry.js

