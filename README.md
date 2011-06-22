Perry
===

Multi-dimensional query string parser and generator.

Install:

    npm install perry

Usage:

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
    // foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42
    var obj = perry.parse(string);

Parsing a query string with empty braces will create an index array beginning with 0 eg.

    perry.parse('foo[]=bar&foo[]=mah');

    result:
    
    {
      foo: ['bar','meh']
    }

However query strings with a numerical index will associate an array with identical indexes eg.

    perry.parse('foo[0]=bar&foo[2]=mah');
    
    result: 
    
    {
      foo: ['bar',undefined,'mah]
    }
    
    Notice the undefined at index 1, this is to keep the array indexes consistant since foo[1] isn't present in the query string. The alternative would be to create a numerically indexed object which may not be expected bahaviour considering an array is expected.

Test:

    node test/test-perry.js

