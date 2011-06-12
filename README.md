Perry
===

PHP style querystring parser and stringifier

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
