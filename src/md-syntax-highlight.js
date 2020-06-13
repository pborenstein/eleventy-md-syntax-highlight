const Prism = require("prismjs");
const PrismLoader = require("./PrismLoader");

/**
 *
 *  The parts of fences:
 *
 *  ``` lang[#/]fenceOptions
 *  fenceBody
 *  ```
 *
 *  ```lang#
 *  turns line numbers on
 *  ```
 *
 *  ```lang#17
 *  turn line numbers on
 *  start numbering at 17
 *  ```
 */

module.exports = function (options = {}) {

  let plugin = function ( fenceBody, fenceText) {

      //  if there's nothing after the
      //  three backquotes, let the
      //  markdown processor handle the fence

    if (!fenceText) {
      return ''
    }

      //  split the fenceText into
      //  the three parts

    let [ language = '',
          fenceMark = '',
          fenceOptions ] = fenceText.split(/\s*(#|\/)\s*/)

    let numberingStart = parseInt(fenceOptions, 10)

    if (isNaN(numberingStart) || fenceMark === '/') {
      numberingStart = 1
    }

    let html = fenceBody
    if (language !== 'text') {
      html = Prism.highlight(fenceBody, PrismLoader(language), language);
    }

        //  Prism's markdown highlighter renders tables
        //  with a newline before the end of the corresponding
        //  markdown line. It's hacky, but I'd rather
        //  fix it up here than figure out how to
        //  fix Prism's markdown highlighter

    if (language === 'markdown') {
      html = html.replace(/<\/span>\n<\/span>/g, '</span></span>\n')
      html = html.replace(/\n<\/span>$/,'</span>')
    }

        //  Count the number of newlines
        //  as defined by NEWLINE_EXP
        //  borrowing from https://github.com/PrismJS/prism/blob/e523f5d0b74044e487001964cc8b4df635f7e9de/plugins/line-numbers/prism-line-numbers.js#L112-L113

    const NEWLINE_EXP = /\n(?!$)/g

		let matches = html.match(NEWLINE_EXP)
		let numberOfLines = matches ? matches.length + 1 : 1

    let lineNumbersHTML = ''
    let lineNumbersClass = ''

    if (options.showLineNumbers || fenceMark === '#') {
      lineNumbersClass = 'line-numbers'
      lineNumbersHTML = '<span aria-hidden="true" class="line-numbers-rows">' +
                          new Array(numberOfLines + 1).join('<span></span>') +
                        '</span>'
    }

    numberingStart--  //  css increments the counter
                      //  before it paints the number
                      //  so we take a step back

    let retStr = `<pre class="language-${language} ${lineNumbersClass}" style="counter-reset: linenumber ${numberingStart}">` +
                    `<code class="language-${language}">` +
                    html + lineNumbersHTML +
                  `</code></pre>`
    return retStr
  }
  return plugin
};

