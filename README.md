Perry
===

PHP style querystring parser and stringifier

Install:

    npm install perry

Usage:

    var perry = require('perry')
    var string = perry.stringify({
      foo: {
        first: {
          second: {
            third: 'bar'
          },
          another: [0,1,2,3,42]
        }
      }
    });
    var obj = perry.parse(string);
