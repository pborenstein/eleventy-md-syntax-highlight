const syntaxHighlight = require("../.eleventy.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    showLineNumbers: false
  })

  eleventyConfig.setTemplateFormats("md,css")
};
