var assert = require('assert');
var util = require('util');
var perry = require('../lib/perry');

var querystringTestCases = [
  {
    parse: 'foo=918854443121279438895193',
    expect: 'foo=918854443121279438895193',
    object: {'foo': '918854443121279438895193'}
  },{
    parse: 'foo=bar',
    expect: 'foo=bar',
    object: {'foo': 'bar'}
  },{
    parse: 'foo[0]=bar&foo[1]=quux',
    expect: 'foo[0]=bar&foo[1]=quux',
    object: {'foo': ['bar', 'quux']}
  },{
    parse: 'foo=1&bar=2',
    expect: 'foo=1&bar=2',
    object: {'foo': '1', 'bar': '2'}
  },{
    parse: 'my+weird+field=q1%212%22%27w%245%267%2Fz8%29%3F',
    expect: 'my%20weird%20field=q1!2%22\'w%245%267%2Fz8)%3F',
    object: {'my weird field': 'q1!2"\'w$5&7/z8)?'}
  },{
    parse: 'foo%3Dbaz=bar',
    expect: 'foo%3Dbaz=bar',
    object: {'foo=baz': 'bar'}
  },{
    parse: 'foo=baz=bar',
    expect: 'foo=baz%3Dbar',
    object: {'foo': 'baz=bar'}
  },{
    parse: 'str=foo&arr[0]=1&arr[1]=2&arr[2]=3&somenull=&undef=',
    expect: 'str=foo&arr[0]=1&arr[1]=2&arr[2]=3&somenull=&undef=',
    object: {'str': 'foo','arr': ['1', '2', '3'],'somenull': '','undef': ''}
  },{
    parse: ' foo = bar ',
    expect: '%20foo%20=%20bar%20',
    object: {' foo ': ' bar '}
  },{
    parse: 'foo=%zx',
    expect: 'foo=%25zx',
    object: {'foo': '%zx'}
  },{
    parse: 'foo=%EF%BF%BD',
    expect: 'foo=%EF%BF%BD',
    object: {'foo': '\ufffd' }
  },{
    parse: 'foo[1][second][third]=123456',
    expect: 'foo[1][second][third]=123456',
    object: {'foo':{'1':{'second':{'third':123456}}}}
  },{
    parse: 'foo[0]=zero&foo[1]=one&foo[2]=two',
    expect: 'foo[0]=zero&foo[1]=one&foo[2]=two',
    object: {'foo':['zero','one','two']}
  },{
    parse: 'foo[bar]=foobar&foobar=1234567890&ubar[x]=0',
    expect: 'foo[bar]=foobar&foobar=1234567890&ubar[x]=0',
    object: {'foo':{'bar':'foobar'},'foobar':1234567890,'ubar':{'x':0}}
  },{
    parse: 'foo[first][second][third]=123&foo[first][second][forth]=456',
    expect: 'foo[first][second][third]=123&foo[first][second][forth]=456',
    object: {'foo':{'first':{'second':{'third':123,'forth':456}}}}
  },{
    parse: 'foo[0]=abc&foo[1]=xyz',
    expect: 'foo[0]=abc&foo[1]=xyz',
    object: {'foo':['abc','xyz']}
  },{
    parse: 'foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42',
    expect: 'foo[first][second][third]=bar&foo[first][another][0]=23&foo[first][another][1]=42',
    object: {'foo':{'first':{'second':{'third':'bar'},'another':[23,42]}}}
  },{
    parse: 'foo[2]=nue&foo[4]=nue&foo[7]=nue',
    expect: 'foo[2]=nue&foo[4]=nue&foo[7]=nue',
    object: {'foo':{'2':'nue','4':'nue','7':'nue'}}
  },{
    parse: 'foo[]=1&bar[]=2',
    expect: 'foo[0]=1&bar[0]=2',
    object: {'foo':[1],'bar':[2]}
  },{
    parse: 'foo[]=0&foo[]=1',
    expect: 'foo[0]=0&foo[1]=1',
    object: {'foo':[0,1]}
  },{
    parse: 'foo[]=0&foo[]=1&bar[]=0&foo[]=2',
    expect: 'foo[0]=0&foo[1]=1&foo[2]=2&bar[0]=0',
    object: {'foo':[0,1,2],'bar':[0]}
  },{
    parse: 'foo[][bar]=0&foo[][meh]=1',
    expect: 'foo[0][bar]=0&foo[1][meh]=1',
    object: {'foo':[{'bar':0},{'meh':1}]}
  },{
    parse: 'foo:bar',
    expect: 'foo:bar',
    object: {'foo': 'bar'},
    params: [';',':','(',')']
  },{
    parse: 'foo(0):bar;foo(1):quux',
    expect: 'foo(0):bar;foo(1):quux',
    object: {'foo': ['bar', 'quux']},
    params: [';',':','(',')']
  },{
    parse: 'foo:1&bar:2;baz:quux',
    expect: 'foo:1%26bar%3A2;baz:quux',
    object: {'foo': '1&bar:2', 'baz': 'quux'},
    params: [';',':','(',')']
  },{
    parse: 'foo%3Abaz:bar',
    expect: 'foo%3Abaz:bar',
    object: {'foo:baz': 'bar'},
    params: [';',':','(',')']
  },{
    parse: 'foo:baz:bar',
    expect: 'foo:baz%3Abar',
    object: {'foo': 'baz:bar'},
    params: [';',':','(',')']
  },{
    expect: 'regexp=%2F.%2Fg',
    object: {regexp: /./g}
  },{
    expect: 'regexp=%2F.%2Fg',
    object: {regexp: new RegExp('.', 'g')}
  }
];

querystringTestCases.forEach(function(testCase,index) {
  testCase.params = testCase.params || ['&','=','[',']'];

  try {
    assert.strictEqual(
      perry.stringify.apply(this,(function() {
        var params = [testCase.object];
        testCase.params.forEach(function(param) {
          params.push(param);
        });
        return params;
      })()),
      testCase.expect
    );
    console.log('✓ stringify test %d', index);
  } catch(e) {
    console.log('\033[31m✗\033[39m stringify test %d', index);
    console.log('  Expected: ' + util.inspect(e.expected));
    console.log('  Got: ' + util.inspect(e.actual));
    console.log('  Using: ' + e.operator);
    console.log('  ' + e.message);
  }
});

querystringTestCases.forEach(function(testCase,index) {
  testCase.params = testCase.params || ['&','=','[',']'];
  
  if(testCase.parse) {
    try {
      assert.deepEqual(
        perry.parse.apply(this,(function() {
          var params = [testCase.parse];
          testCase.params.forEach(function(param) {
            params.push(param);
          });
          return params;
        })()),
        testCase.object
      );
      console.log('✓ parse test %d', index);
    } catch(e) {
      console.log('\033[31m✗\033[39m parse test %d', index);
      console.log('  Expected: ' + util.inspect(e.expected));
      console.log('  Got: ' + util.inspect(e.actual));
      console.log('  Using: ' + e.operator);
      console.log('  ' + e.message);
    }
  }
});