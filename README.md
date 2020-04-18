# eleventy-md-syntax-highlight

PrismJS syntax highlighting
with optional line numbers
for Eleventy.

An alternative to the
[official syntax highlighting plugin][official-syntaxhighlight].

## Installation

``` text
npm install github:pborenstein/eleventy-md-syntax-highlight --save-dev
```

## Usage

In your Eleventy configuration file
(typically `.eleventy.js`)
install the plugin like this:

```js
const syntaxHighlight = require('eleventy-md-syntax-highlight')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, { showLineNumbers: true })

};
```




[official-syntaxhighlight]: https://www.11ty.dev/docs/plugins/syntaxhighlight/
