<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <link rel="stylesheet" href="../prism-theme.css">
    <link rel="stylesheet" href="../test.css">
    <link rel="stylesheet" href="../prism-line-numbers.css">
  </head>
  <body>

Backquotes (`js#1`)

```ab . 1
let foo = `tick tock`
let bar = `times up`
```

Backquotes for `tick tock` spread over two lines js # 5

```js#3
xlet foo = `tick
tock`
let bar = `times up`
```



markdown#23

``` markdown#23
No depending be convinced in unfeeling he.
Excellence she unaffected and too sentiments
her. Rooms he doors there ye aware in by shall.
Education remainder in so cordially. His
remainder and own dejection daughters
sportsmen. Is easy took he shed to kind.
```

markdown#

``` markdown#
| State         | Capital |
| :------------ | :------ |
| New York      | Albany  |
| Nebraska      | Lincoln |
| New Hampshire | Concord |
```


js

``` js
var { graphql, buildSchema } = require("graphql");

/*
  a thing
  another
*/

// this could also be `async function`
module.exports = function() {
  // if you want to `await` for other things here, use `async function`
  var schema = buildSchema(`type Query {
    hello: String
  }`);

  var root = {
    hello: () => "Hello world async!"
  };

  return graphql(schema, "{ hello }", root);
};
```

markdown

``` markdown
| State         | Capital |
| :------------ | :------ |
| New York      | Albany  |
| Nebraska      | Lincoln |
| New Hampshire | Concord |
```

markdown#

``` markdown
| State         | Capital |
| :------------ | :------ |
| New York      | Albany  |
| Nebraska      | Lincoln |
| New Hampshire | Concord |
```


text with blank lines text#1

``` text#1
this is line one

this is line three
```


a json thing json#0-2,4

``` json#0-2,4
collections: {
  "all": [ items ],
  "categories": {
    "Culture": [ items ],
    "Life": [ items ],
    "Thinking": [ items ]
  }
}
```

json add/del json/1-3,5,9/0,8,10-12

```json/1-3,5,9/0,8,10-12
{
  "all": [...],
  "nav": [...],
  "books": [
    {
      "inputPath": "./src/articles/finding-oz.md",
      "outputPath": "_site/articles/finding-oz/index.html",
      "fileSlug": "finding-oz",
      "data": {...},
      "date": "2009-08-07T13:52:12.000Z",
      "url": "/articles/finding-oz/",
      "templateContent": "<p>As with most books ... much about The Wizard of Oz</li>\n</ul>\n",
      "template": {...}
    },
    ...
  ],
  "programming": [...],
}
```
  </body>
</html>
