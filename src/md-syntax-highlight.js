const Prism = require("prismjs");
const PrismLoader = require("./PrismLoader");

/**
 *
 *  lang / 1,2,5-8
 *    highlight lines 1,2,5,6,7,8
 *
 *  lang / 1, 9 / 2-4,6
 *    add lines 1, 9
 *    delete lines 2,3,4,6
 *
 *  The parts of fences
 *
 *  ``` lang[#/]fenceOptions
 *  fenceBody
 *  ```
 *
 */

module.exports = function (options = { showLineNumbers: true}) {

  let plugin = function ( fenceBody, fenceText) {

      //  if there's nothin after the
      //  three backquotes, let the
      //  markdown processor handle the fence

    if (!fenceText) {
      return ''
    }

    let [ language = '',
          fenceMark = '',
          fenceOptions ] = fenceText.split(/\s*(#|\/)\s*/)

    numberingStart = parseInt(fenceOptions, 10)
    if (isNaN(numberingStart) || fenceMark === '/')
      numberingStart = 1

      //  turn the fenceBody into HTML

    let html = fenceBody
    if (language !== 'text') {
      html = Prism.highlight(fenceBody, PrismLoader(language), language);
    }

        //  Prism's markdown highlighter renders tables
        //  with a newline before the end of the corresponding
        //  markdown line. It's hacky, but I'd rather
        //  fix it up here than figure out how to
        //  fix Prism's markdown highlighter
        //  and some shenanigans for the extra line
        //  at the end of the table

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

    numberingStart--  //  css counting increments
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

