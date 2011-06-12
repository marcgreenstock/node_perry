var assert = require('assert');
var perry = require('../lib/perry');

var testCases = [
  ['foo=bar',{'foo':'bar'}],
  ['foo=bar&bar=foo',{'foo':'bar','bar':'foo'}],
  ['foo=bar&null=&othernull=',{'foo':'bar','null':'','othernull':''}],
  ['foo[1][second][third]=123456',{'foo':{'1':{'second':{'third':123456}}}}],
  ['foo[0]=zero&foo[1]=one&foo[2]=two',{'foo':['zero','one','two']}],
  ['foo[bar]=foobar&foobar=1234567890&ubar[x]=0',{'foo':{'bar':'foobar'},'foobar':1234567890,'ubar':{'x':0}}],
  ['foo[first][second][third]=123&foo[first][second][forth]=456',{'foo':{'first':{'second':{'third':123,'forth':456}}}}],
  ['foo[0]=abc&foo[1]=xyz',{'foo':['abc','xyz']}]
];

testCases.forEach(function(testCase,index) {
  console.log('Test: ' + index);
  assert.strictEqual(
    perry.stringify(testCase[1]),
    testCase[0]
  );
  assert.deepEqual(
    perry.parse(testCase[0]),
    testCase[1]
  );
});