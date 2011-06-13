var assert = require('assert');
var perry = require('../lib/perry');

var qsTestCases = [
  ['foo=918854443121279438895193',
   'foo=918854443121279438895193',
   {'foo': '918854443121279438895193'}],
  ['foo=bar', 'foo=bar', {'foo': 'bar'}],
  ['foo[0]=bar&foo[1]=quux', 'foo[0]=bar&foo[1]=quux', {'foo': ['bar', 'quux']}],
  ['foo=1&bar=2', 'foo=1&bar=2', {'foo': '1', 'bar': '2'}],
  ['my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F',
   'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F',
   {'my weird field': 'q1!2"\'w$5&7/z8)?' }],
  ['foo%3Dbaz=bar', 'foo%3Dbaz=bar', {'foo=baz': 'bar'}],
  ['foo=baz=bar', 'foo=baz%3Dbar', {'foo': 'baz=bar'}],
  ['str=foo&arr[0]=1&arr[1]=2&arr[2]=3&somenull=&undef=',
   'str=foo&arr[0]=1&arr[1]=2&arr[2]=3&somenull=&undef=',
   { 'str': 'foo',
     'arr': ['1', '2', '3'],
     'somenull': '',
     'undef': ''}],
  [' foo = bar ', '%20foo%20=%20bar%20', {' foo ': ' bar '}],
  ['foo=%zx', 'foo=%25zx', {'foo': '%zx'}],
  ['foo=%EF%BF%BD', 'foo=%EF%BF%BD', {'foo': '\ufffd' }]
];

var phpTestCases = [
  ['foo=bar',{'foo':'bar'}],
  ['foo=bar&bar=foo',{'foo':'bar','bar':'foo'}],
  ['foo=bar&null=&othernull=',{'foo':'bar','null':'','othernull':''}],
  ['foo[1][second][third]=123456',{'foo':{'1':{'second':{'third':123456}}}}],
  ['foo[0]=zero&foo[1]=one&foo[2]=two',{'foo':['zero','one','two']}],
  ['foo[bar]=foobar&foobar=1234567890&ubar[x]=0',{'foo':{'bar':'foobar'},'foobar':1234567890,'ubar':{'x':0}}],
  ['foo[first][second][third]=123&foo[first][second][forth]=456',{'foo':{'first':{'second':{'third':123,'forth':456}}}}],
  ['foo[0]=abc&foo[1]=xyz',{'foo':['abc','xyz']}],
  ['foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42',{foo:{first:{second:{third:'bar'},another:[23,42]}}}],
  ['foo[2]=nue&foo[4]=nue&foo[7]=nue',{'foo':{'2':'nue','4':'nue','7':'nue'}}]
];

phpTestCases.forEach(function(testCase,index) {
  console.log('PHP test: ' + index);
  assert.strictEqual(
    perry.stringify(testCase[1]),
    testCase[0]
  );
  assert.deepEqual(
    perry.parse(testCase[0]),
    testCase[1]
  );
});

qsTestCases.forEach(function(testCase,index) {
  console.log('QS test: ' + index);
  assert.strictEqual(
    perry.stringify(testCase[2]),
    testCase[1]
  );
  assert.deepEqual(
    perry.parse(testCase[0]),
    testCase[2]
  );
});