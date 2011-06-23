var start = new Date();
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
    object: {'str': 'foo','arr': ['1', '2', '3'],'somenull': null,'undef': null}
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
    object: {'foo':[undefined,{'second':{'third':123456}}]}
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
    object: {'foo':[undefined,undefined,'nue',undefined,'nue',undefined,undefined,'nue']}
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
    parse: 'foo[0]=meh&foo[2]=bar',
    expect: 'foo[0]=meh&foo[2]=bar',
    object: {'foo':['meh',undefined,'bar']}
  },{
    parse: 'glossary[title]=example glossary&glossary[GlossDiv][title]=S&glossary[GlossDiv][GlossList][GlossEntry][ID]=SGML&glossary[GlossDiv][GlossList][GlossEntry][SortAs]=SGML&glossary[GlossDiv][GlossList][GlossEntry][GlossTerm]=Standard Generalized Markup Language&glossary[GlossDiv][GlossList][GlossEntry][Acronym]=SGML&glossary[GlossDiv][GlossList][GlossEntry][Abbrev]=ISO 8879:1986&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][para]=A meta-markup language, used to create markup languages such as DocBook.&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][GlossSeeAlso][]=GML&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][GlossSeeAlso][]=XML&glossary[GlossDiv][GlossList][GlossEntry][GlossSee]=markup',
    expect: 'glossary[title]=example%20glossary&glossary[GlossDiv][title]=S&glossary[GlossDiv][GlossList][GlossEntry][ID]=SGML&glossary[GlossDiv][GlossList][GlossEntry][SortAs]=SGML&glossary[GlossDiv][GlossList][GlossEntry][GlossTerm]=Standard%20Generalized%20Markup%20Language&glossary[GlossDiv][GlossList][GlossEntry][Acronym]=SGML&glossary[GlossDiv][GlossList][GlossEntry][Abbrev]=ISO%208879%3A1986&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][para]=A%20meta-markup%20language%2C%20used%20to%20create%20markup%20languages%20such%20as%20DocBook.&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][GlossSeeAlso][0]=GML&glossary[GlossDiv][GlossList][GlossEntry][GlossDef][GlossSeeAlso][1]=XML&glossary[GlossDiv][GlossList][GlossEntry][GlossSee]=markup',
    object: {
      "glossary": {
        "title": "example glossary",
        "GlossDiv": {
          "title": "S",
          "GlossList": {
            "GlossEntry": {
              "ID": "SGML",
              "SortAs": "SGML",
              "GlossTerm": "Standard Generalized Markup Language",
              "Acronym": "SGML",
              "Abbrev": "ISO 8879:1986",
              "GlossDef": {
                "para": "A meta-markup language, used to create markup languages such as DocBook.",
                "GlossSeeAlso": ["GML", "XML"]
              },
              "GlossSee": "markup"
            }
          }
        }
      }
    }
  },{
    parse: 'widget[debug]=on&widget[window][title]=Sample Konfabulator Widget&widget[window][name]=main_window&widget[window][width]=500&widget[window][height]=500&widget[image][src]=Images/Sun.png&widget[image][name]=sun1&widget[image][hOffset]=250&widget[image][vOffset]=250&widget[image][alignment]=center&widget[text][data]=Click Here&widget[text][size]=36&widget[text][style]=bold&widget[text][name]=text1&widget[text][hOffset]=250&widget[text][vOffset]=100&widget[text][alignment]=center&widget[text][onMouseUp]=sun1.opacity = (sun1.opacity / 100) * 90;',
    expect: 'widget[debug]=on&widget[window][title]=Sample%20Konfabulator%20Widget&widget[window][name]=main_window&widget[window][width]=500&widget[window][height]=500&widget[image][src]=Images%2FSun.png&widget[image][name]=sun1&widget[image][hOffset]=250&widget[image][vOffset]=250&widget[image][alignment]=center&widget[text][data]=Click%20Here&widget[text][size]=36&widget[text][style]=bold&widget[text][name]=text1&widget[text][hOffset]=250&widget[text][vOffset]=100&widget[text][alignment]=center&widget[text][onMouseUp]=sun1.opacity%20%3D%20(sun1.opacity%20%2F%20100)%20*%2090%3B',
    object: {
      "widget": {
        "debug": "on",
        "window": {
          "title": "Sample Konfabulator Widget",
          "name": "main_window",
          "width": 500,
          "height": 500
        },
        "image": { 
          "src": "Images/Sun.png",
          "name": "sun1",
          "hOffset": 250,
          "vOffset": 250,
          "alignment": "center"
        },
        "text": {
          "data": "Click Here",
          "size": 36,
          "style": "bold",
          "name": "text1",
          "hOffset": 250,
          "vOffset": 100,
          "alignment": "center",
          "onMouseUp": "sun1.opacity = (sun1.opacity / 100) * 90;"
        }
      }
    }
  },{
    parse: 'menu[header]=SVG%20Viewer&menu[items][0][id]=Open&menu[items][1][id]=OpenNew&menu[items][1][label]=Open%20New&menu[items][2]=&menu[items][3][id]=ZoomIn&menu[items][3][label]=Zoom%20In&menu[items][4][id]=ZoomOut&menu[items][4][label]=Zoom%20Out&menu[items][5][id]=OriginalView&menu[items][5][label]=Original%20View&menu[items][6]=&menu[items][7][id]=Quality&menu[items][8][id]=Pause&menu[items][9][id]=Mute&menu[items][10]=&menu[items][11][id]=Find&menu[items][11][label]=Find...&menu[items][12][id]=FindAgain&menu[items][12][label]=Find%20Again&menu[items][13][id]=Copy&menu[items][14][id]=CopyAgain&menu[items][14][label]=Copy%20Again&menu[items][15][id]=CopySVG&menu[items][15][label]=Copy%20SVG&menu[items][16][id]=ViewSVG&menu[items][16][label]=View%20SVG&menu[items][17][id]=ViewSource&menu[items][17][label]=View%20Source&menu[items][18][id]=SaveAs&menu[items][18][label]=Save%20As&menu[items][19]=&menu[items][20][id]=Help&menu[items][21][id]=About&menu[items][21][label]=About%20Adobe%20CVG%20Viewer...',
    expect: 'menu[header]=SVG%20Viewer&menu[items][0][id]=Open&menu[items][1][id]=OpenNew&menu[items][1][label]=Open%20New&menu[items][2]=&menu[items][3][id]=ZoomIn&menu[items][3][label]=Zoom%20In&menu[items][4][id]=ZoomOut&menu[items][4][label]=Zoom%20Out&menu[items][5][id]=OriginalView&menu[items][5][label]=Original%20View&menu[items][6]=&menu[items][7][id]=Quality&menu[items][8][id]=Pause&menu[items][9][id]=Mute&menu[items][10]=&menu[items][11][id]=Find&menu[items][11][label]=Find...&menu[items][12][id]=FindAgain&menu[items][12][label]=Find%20Again&menu[items][13][id]=Copy&menu[items][14][id]=CopyAgain&menu[items][14][label]=Copy%20Again&menu[items][15][id]=CopySVG&menu[items][15][label]=Copy%20SVG&menu[items][16][id]=ViewSVG&menu[items][16][label]=View%20SVG&menu[items][17][id]=ViewSource&menu[items][17][label]=View%20Source&menu[items][18][id]=SaveAs&menu[items][18][label]=Save%20As&menu[items][19]=&menu[items][20][id]=Help&menu[items][21][id]=About&menu[items][21][label]=About%20Adobe%20CVG%20Viewer...',
    object: {
      "menu": {
        "header": "SVG Viewer",
        "items": [
          {"id": "Open"},
          {"id": "OpenNew", "label": "Open New"},
          null,
          {"id": "ZoomIn", "label": "Zoom In"},
          {"id": "ZoomOut", "label": "Zoom Out"},
          {"id": "OriginalView", "label": "Original View"},
          null,
          {"id": "Quality"},
          {"id": "Pause"},
          {"id": "Mute"},
          null,
          {"id": "Find", "label": "Find..."},
          {"id": "FindAgain", "label": "Find Again"},
          {"id": "Copy"},
          {"id": "CopyAgain", "label": "Copy Again"},
          {"id": "CopySVG", "label": "Copy SVG"},
          {"id": "ViewSVG", "label": "View SVG"},
          {"id": "ViewSource", "label": "View Source"},
          {"id": "SaveAs", "label": "Save As"},
          null,
          {"id": "Help"},
          {"id": "About", "label": "About Adobe CVG Viewer..."}
        ]
      }
    }
  },{
    parse: 'foo%5B%5D=bar',
    expect: 'foo[0]=bar',
    object: {'foo':['bar']}
  },{
    parse: 'bob%5Bbim%5D=abc&bob%5Bboo%5D=2011-07-01&bob%5Bbap%5D=D20&bob%5Bbip%5D=%5B%5D',
    expect: 'bob[bim]=abc&bob[boo]=2011-07-01&bob[bap]=D20&bob[bip]=%5B%5D',
    object: {'bob':{'bim':'abc','boo':'2011-07-01','bap':'D20','bip':'[]'}}
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

var fails = [];
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
    process.stdout.write('.');
  } catch(e) {
    process.stdout.write('\033[31mx\033[39m');
    fails.push({test: index, method: 'stringify', exception: e});
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
      process.stdout.write('.');
    } catch(e) {
      process.stdout.write('\033[31mx\033[39m');
      fails.push({test: index, method: 'parse', exception: e});
    }
  }
});

var end = new Date();
var duration = end.getTime() - start.getTime();

process.stdout.write('\n' + querystringTestCases.length + ' tests, ' + fails.length + ' failures in ' + duration + 'ms.\n');
fails.forEach(function(fail) {
  console.log('\033[31m' + fail.method + ' test ' + fail.test + '\033[39m');
  if(fail.exception.expected && fail.exception.actual && fail.exception.operator) {
    console.log('  Expected: ' + util.inspect(fail.exception.expected,false,null));
    console.log('  Got: ' + util.inspect(fail.exception.actual,false,null));
    console.log('  Using: ' + fail.exception.operator);
  } else if(fail.exception.stack) {
    console.log(fail.exception.stack);
  }
});

