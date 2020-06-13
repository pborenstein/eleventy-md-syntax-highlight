//  https://github.com/11ty/eleventy-plugin-syntaxhighlight/tree/master/src
const Prism = require("prismjs");
const PrismLoader = require("prismjs/components/index.js");
const PrismAlias = require("./PrismNormalizeAlias");

module.exports = function(language) {
  let normalizedLanguage = PrismAlias(language);
  if(!Prism.languages[ normalizedLanguage ]) {
    PrismLoader(normalizedLanguage);
  }
  if(!Prism.languages[normalizedLanguage]) {
    throw new Error(`"${language}" is not a valid Prism.js language for eleventy-md-syntax-highlight`);
  }
  return Prism.languages[ normalizedLanguage ];
};
