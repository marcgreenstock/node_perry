Perry
===

Multi-dimensional query string parser and generator.

Install:

    npm install perry

Require Perry:

    var Perry = require('perry');

Perry.stringify usage:

    Perry.stringify({
      foo: {
        first: {
          second: {
            third: 'bar'
          },
          another: [23,42]
        }
      }
    });

Returned result:

    foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42

Perry.parse usage:    

    Perry.parse('foo[0][bar][0]=meh&foo[0][bar][1]=beh&foo[1][bar][0]=teh');
    
Returned result:

    {
      foo: [{
        bar: ['meh','beh']
      },{
        bar: ['teh']
      }]
    }
    
Perrry.parse a query string with empty braces will create an index array beginning with 0:

    Perry.parse('foo[]=bar&foo[]=mah');

Returned result:
    
    {
      foo: ['bar','meh']
    }

Perry.parse a query strings with a numerical index will associate an array with identical indexes:

    Perry.parse('foo[0]=bar&foo[2]=mah');
    
Returned result: 
    
    {
      foo: ['bar',undefined,'mah]
    }
    
Notice the undefined at index 1, this is to keep the array indexes consistent since foo[1] isn't present in the query string. The alternative would be to create a numerically indexed object which may not be expected behaviour considering an array is expected.

Test:

    node test/test-perry.js

