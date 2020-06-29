/****
 *  FenceSpec:
 *
 *  tools for parsing the text in
 *  Markdown code fences
 *
 *  ```fenceText
 *  fenceBody
 *  ```
 *
 * fencetext   ::= [language ['#' [startNumber]] ['/' linespec ['/' linespec ]]]
 * language    ::= <identifier>
 * startNumber ::= <int>
 * linespec    ::= <rangespec> | <rangespec> , <linespec>
 * rangespec   ::= <int> | <int>-<int>
 *
 *  turns line numbers on
 *  ```lang#
 *
 *  turn line numbers on
 *  start numbering at 17
 *  ```lang#17
 *
 *  highlight lines 1, 4, 6, 7, 8
 *  ```lang/1,4,6-8
 *
 *  Mark add/delete
 * add lines 1-3
 * delete lines 4,5,8
 *  ```lang/1-3,6/4-5,8
 *
 ****/


function isObjectEmpty(o) {
  return Object.keys(o).length === 0
}

class FenceSpec {
  regex = /[-#\/]|\d+-\d+|\d+|\w+/g   // -#/ 11-22 33 words

  constructor(fenceText) {
    this.fenceText      = fenceText
    this.origTokens     = this.tokenizeFenceText()
    this.t              = [...this.origTokens]
    this.language       = ''
    this.hasLineNumbers = false
    this.hasHighlights  = false
    this.hasAddDel      = false
    this.startNumber    = 1
    this.highlights     = {}                //  does two things
    this.inserts        = this.highlights   //  gets two names
    this.deletes        = {}
  }

  tokenizeFenceText() {
    let t = this.fenceText.matchAll(this.regex)
    return Array.from(t, m => m[0])
  }

  getLanguage() {
    let t = this.t

    //  language names are alphanumeric
    //  and sometimes have a dash
    //    https://prismjs.com/#supported-languages
    if (t[0] && t[0].match(/[-a-z0-9]+/i))
      this.language = t.shift()

      return this
  }

  getNumbering() {
    let t = this.t

    if (t[0] != '#')
      return ;

    this.hasLineNumbers = true
    t.shift()   // eat the '#'

    let n = parseInt(t[0], 10)
    if (Number.isInteger(n)) {
      this.startNumber = n
      t.shift() // eat the line start number
    }
    return this
  }

  getLines(propName) {
    let t = this.t

    if (t[0] != '/')
      return ;

    this.hasHighlights = true
    t.shift() // eat the /

      //  stop when we're no longer working on
      //    - digits or
      //    - hyphens
    while (t[0] && t[0].match(/[-0-9]/)) {
      this.getRangeSpec(t.shift(), propName)
    }
  }

  getRangeSpec(rangeSpec, propName) {
    // '25' or '12-17'
    let hash  = this[propName]
    let r     = rangeSpec.split('-')
    let start = parseInt(r[0], 10)
    let end   = parseInt(r[1] || start, 10)

    for (let i = start; i <= end; i++) {
      hash[i] = true
    }
    return this
  }
}

const parseFenceText = (fenceText) => {
  let f = new FenceSpec(fenceText)

  f.getLanguage()
  f.getNumbering()
  f.getLines('highlights')
  f.getLines('deletes')

  f.hasAddDel      =  isObjectEmpty(f.deletes)
                      ? false
                      : (f.hasHighlights = false, true) // I am a horrible person

                      return f
}

module.exports =  parseFenceText 
