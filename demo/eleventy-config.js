const syntaxHighlight = require("../plugin.js");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    showLineNumbers: false
  })

  eleventyConfig.addPassthroughCopy({
    "node_modules/prismjs/themes/*.css": "css/"
  })

  eleventyConfig.setTemplateFormats("md,css")
};
