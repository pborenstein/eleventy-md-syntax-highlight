const Prism = require("prismjs")
const PrismLoader = require("./PrismLoader")
const parseFenceText = require("./parseFenceText")

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

    if (!fenceText)
      return ''

    let fenceSpec = parseFenceText(fenceText)
    

    let html = fenceBody

    //  This iw where the highlighting happens
      
    if (fenceSpec.language !== 'text') {
      html = Prism.highlight(fenceBody, PrismLoader(fenceSpec.language), fenceSpec.language);
    }

    //  Prism's markdown highlighter renders tables
    //  with a newline before the end of the corresponding
    //  markdown line. It's hacky, but I'd rather
    //  fix it up here than figure out how to
    //  fix Prism's markdown highlighter

    if (fenceSpec.language === 'markdown') {
      html = html.replace(/<\/span>\n<\/span>/g, '</span></span>\n')
      html = html.replace(/\n<\/span>$/,'</span>')
    }

    let lineNumbersHTML = ''
    let lineNumbersClass = ''
    let s = ''

    if (options.showLineNumbers || fenceSpec.hasLineNumbers || fenceSpec.hasAddDel  ) {

      //  Count the number of newlines
      //  as defined by NEWLINE_EXP
      //  borrowing from https://github.com/PrismJS/prism/blob/e523f5d0b74044e487001964cc8b4df635f7e9de/plugins/line-numbers/prism-line-numbers.js#L112-L113

      let matches = html.match(/\n(?!$)/g)    //  newlines except at
                                              //  end of the string
      let numberOfLines = matches ? matches.length + 1 : 1

      //  make as many <soan></soan> pairs
      //  as there are lines in the HTML 
      //  adding highlight
      
      for (let i = 1; i <= numberOfLines; i++ ) {

        //  this is essentially a compact version of
        //  if-then-elseif-then-else
        //  looks easier to read than the table

        let m =
          (fenceSpec.hasHighlights && fenceSpec.highlights[i])
          ? options.colorHighlight

          : (fenceSpec.hasAddDel && fenceSpec.deletes[i])
          ? options.colorDelete

          : (fenceSpec.hasAddDel && fenceSpec.inserts[i])
          ? options.colorInsert

          : 'inherit'

        s += `<span style="background: ${m}"></span>`
      }

      lineNumbersClass = 'line-numbers'
      lineNumbersHTML = '<span aria-hidden="true" class="line-numbers-rows">' +
                          s +
                        '</span>'
    }

    let numberingStart = fenceSpec.startNumber - 1  //  css increments the counter
                                                    //  before it paints the number
                                                    //  so we take a step back

    let retStr = `<pre class="language-${fenceSpec.language} ${lineNumbersClass}" style="counter-reset: linenumber ${numberingStart}">` +
                    `<code class="language-${fenceSpec.language}">` +
                    html + lineNumbersHTML +
                  `</code></pre>`
    return retStr
  }
  return plugin
};

