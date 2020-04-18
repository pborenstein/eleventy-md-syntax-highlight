This is the story of my trying to add
line numbers to [Eleventy's][]
[Syntax Highlighting Plugin][syntaxhighlight-doc].

## Why we can't use the prism.js Plugin

The easiest thing to do
would be to use
Prism's
[official line numbering plugin][prism-line-numbers].
But that won't work in Eleventy
because that plugin only works
in a browser environment.

The official plugin has some requirements:

- it has to do syntax highlighting, duh
- it has to be able to highlight lines

## How things work

First, let's understand what we're working with.

The [official Eleventy syntax-highlighting plugin][syntaxhighlight-gh]
works like this:

1.  Use the syntax highlighting hook in eleventy,
    but not the hook in prismjs
2.  Take the stuff in a Markdown code fence
    and give it to the syntax plugin
3.  The plugin looks at the language line and loads
    the appropriate prism language handler
    unless the language is `text`
    which we just leave alone without letting
    prism touch it which explains -- nvm
4.  it parses the stuff beyond the language with
    a slash as a list of lines to highlight _or_
    to mark as added/deleted
5.  To highlight lines, the plugin splits
    the prism-ed HTML on newlines
    and then wraps the lines to be highlighted
    with a `<mark>`, `<ins>`, `<del>` element
    and adds a `<br>` where prism gave us
    a plain old newline.

    So a marked line looks like this:

    ```
    <mark>
      . . .
    </mark><br>
    ```


6.  but there's a problem:
    if a syntax rule spans a line, you end up
    with a situation that looks like this.

    This Markdown:

    ``` markdown
``` js/2
let foo = `tick
tock`
let bar = `times up`
```
    ```

    line 2, the one we want to mark,
    is rendered into HTML like this:


    ```html
. . . <br>
        <mark>tock
      </span>
      <span>`</span>
    </span></mark><br>
. . .
    ```

    Putting the `<mark>` tags at the beginning and end of the line,
    results in bad HTML markup in cases like this.

    The way the official plugin handles this case
    is by checking whether a line
    (the stuff between one `<br>` and the next)
    is "valid" HTML.[^valid]
    If it's not, the `<mark>` tags don't get added.


[^valid]: It's actually just checking
          for balanced `<span>` tags
          in a line.


In short, with the official Eleventy syntax highlighting plugin,
you cannot highlight a line that is not valid HTML on its own.
But with the Prismjs plugin, it's no problem.

How come?

## How does the prismjs plugin do highlighting?

So we know that the OESHPI (official Eleventy Syntax-Hilighting Plug In)
works by

- splitting up the lines with `<br>` instead of newlines
- surrounding the stuff between `<br>` tag pairs
  with a highlighting tag like `<mark>`

The [Prism line highlight plugin][prism-line-highlight] does not work like that.
No, siree.

This is what it looks like. When PHL runs,
on this:

```html
<pre>
<code class="language-js">let foo = `tick
tock`
let bar = `times up`
</code></pre>
```

it generates this HTML

```
<pre>
  <code>
    <span>let</span> foo
    <span>=</span>
    <span>
      <span>`</span>
      <span>tick
        tock</span>
      <span>`</span>
    </span>
    <span>let</span> bar
    <span>=</span>
    <span>
      <span>`</span>
      <span>times up</span>
      <span>`</span>
    </span>
  </code>
</pre>
```


with line highlighting on lines 2-3:

```
<pre data-line="2-3">
  <code>
    <span>let</span> foo
    <span>=</span>
    <span>
      <span>`</span>
      <span>tick
        tock</span>
      <span>`</span>
    </span>
    <span>let</span> bar
    <span>=</span>
    <span>
      <span>`</span>
      <span>times up</span>
      <span>`</span>
    </span>
    <div aria-hidden="true" class=" line-highlight" data-range="2-3" data-start="2" data-end="3" style="top: 24px;">
    </div>
  </code>
</pre>
```

All the work is being done is being done by `<div>` and three CSS classes:

- `line-highlight`
- `line-highlight::before`
- `line-highlight::after`

The `<div>` contains as many newlines as there are lines to highlight.
The `::before` and `::after` CSS
are what actually prints the numbers.

So essentially
PHE calculates where the first line of the highlight starts
adds the proper number of newlines to a div
and styles the div to do the contrast.

Can we do that in Eleventy? Probably not.
There's an issue of how to parse line heights.

Looking at the repo history,
we see that this plugin
started as liquid plugin
and highlighting was the point,
not syntax highlighting.




[syntaxhighlight-gh]:   https://github.com/11ty/eleventy-plugin-syntaxhighlight
[syntaxhighlight-doc]:  https://www.11ty.dev/docs/plugins/syntaxhighlight/
[prism-line-numbers]:   https://prismjs.com/plugins/line-numbers/
[prism-line-highlight]: https://prismjs.com/plugins/line-highlight/

---
# Episode IV: A New Hope

This is the story of my trying to add
line numbers to [Eleventy's][]
[Syntax Highlighting Plugin][syntaxhighlight-doc].

## Why we can't use the prism.js Plugin

The easiest thing to do
would be to use
Prism's
[official line numbering plugin][prism-line-numbers].
But that won't work in Eleventy
because that plugin only works
in a browser environment.


## These are the names of things

```markdown
 ```<fenceLang><fenceMark><fenceOptions>
 . . .
 <fenceBody>
 . . .
 ```

```

Here's an example. The table might also be useful.

```
 ```js / 1,2,5-8
  if (language === 'markdown') {
    html = html.replace(/<\/span>\n<\/span>/g, '</span></span>\n')
    html = html.replace(/\n<\/span>$/,'</span>')
  }
  ```
```
<span> </span>

| name           | description                            | example               |
| :------------- | :------------------------------------- | :-------------------- |
| `fenceBody`    | The whole fence code block             | The code in the fence |
| `fenceLang`    | The language to highlight in the fence | `js`                  |
| `fenceOptions` | Options for the fence                  | `/ 1,2,5-8`           |

## Extending the options

Eleventy's [Syntax Highlighting Plugin][syntaxhighlight-doc]
uses the slash `\` along with numbers and ranges
to specify the lines to be highlighted:


| options               | meaning                                                                     |
| :-------------------- | :-------------------------------------------------------------------------- |
| `lang / 1,2,5-8`      | highlight lines 1,2,5,6,7,8  with `<mark>`                                  |
| `lang / 1, 9 / 2-4,6` | highlight lines 1, 9 with `<ins>` <br> highlight lines 2,3,4,6 with `<del>` |

The official plugin needed highlighted lines.
I mostly care about line numbers, but
in the fullness of time
I want to leave open the possibility of
backward compatibility
so I'll use a hash `#` for our options.


| options | meaning                     |
| :------ | :-------------------------- |
| `#`     | Turn on line numbering      |
| `# 12`  | Start numbering lines at 12 |


[syntaxhighlight-gh]: https://github.com/11ty/eleventy-plugin-syntaxhighlight
[syntaxhighlight-doc]: https://www.11ty.dev/docs/plugins/syntaxhighlight/
[prism-line-numbers]: https://prismjs.com/plugins/line-numbers/
