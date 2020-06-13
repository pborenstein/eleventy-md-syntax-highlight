const syntaxHighlighter = require("./src/md-syntax-highlight");

module.exports = function(eleventyConfig, options = {}) {
    options = Object.assign({ showLineNumbers: false}, options);

    //  this is where the plugin code gets hooked up
    //  in the default md's highlighter

    eleventyConfig.addMarkdownHighlighter(syntaxHighlighter(options));
  }
