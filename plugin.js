const syntaxHighlighter = require("./src/md-syntax-highlight");

defaultOptions = {
  showLineNumbers: true,
  colorHighlight: "#ffea00",  // "yellow",
  colorInsert:    "#58f358",  // "green",
  colorDelete:    "#fd5a5a"   // "red"
}

module.exports = function(eleventyConfig, options = {}) {
    options = Object.assign(defaultOptions, options);

    //  this is where the plugin code gets hooked up
    //  in the default md's highlighter

    eleventyConfig.addMarkdownHighlighter(syntaxHighlighter(options));
  }
