const syntaxHighlight = require("../plugin.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    showLineNumbers: false
  })

  eleventyConfig.setTemplateFormats("md,css")
};
