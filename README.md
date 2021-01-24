# Flow

A compact web based **rich-text editor** that builds on top of [Slate-js][] with powerful, yet simple and accessible editing capabilities.

It’s using a design system not just for its simplified UI but also for handling efficient and consistent document **styling**, this means that it may _lack_ some capabilities of other rich-text editors by design, however in exchange you get consistent **look** and possibly **good typography** across all your documents (as far as web-standards allow it). Altough Flow can be opened and used inside various mobile browsers, it’s not officially supported by [Slate-js][].

## Usage

Use the buttons in the tools section at the top of Flow or use _keyboard_ sortcuts listed in the table below to toggle _mark-style_ formating like **Bold** and _Italic_ or _block-style_ formating like Paragraphs, Heading types and Aligning.

| Shortcut          | Description                             |
| ----------------- | --------------------------------------- |
| `Ctrl or Cmd + z` | Undo                                    |
| `Ctrl or Cmd + y` | Redo                                    |
| `Ctrl or Cmd + c` | Copy                                    |
| `Ctrl or Cmd + x` | Cut                                     |
| `Ctrl or Cmd + v` | Paste                                   |
| `Ctrl or Cmd + b` | Toggle format on text to **Bold**       |
| `Ctrl or Cmd + i` | Toggle format on text to _Italic_       |
| `Alt + 0`         | Turn block into code (monospaced block) |
| `Alt + 1`         | Turn block into paragraph               |
| `Alt + 2`         | Turn block into heading                 |

Flow will highlight buttons when their format is active.

Flow has an autosaving feature that saves your currently edited document to your browser’s _local-storage_ container under a `value` key, which you can access through the developer-tools of your browser.

Flow will display some editing statistics at the bottom like word counts, character counts, with, without trailing and without spaces respectively. The algorithm skips standard ASCII puncturation, some special characters (`—`, `’`, `“` and `”`), all three types of line breaks (`\r\n`, `\r` and `\n`) and digits (`0-9`) when counting words. It will only give honest results if you treat text correctly, type and grammar errors, mistyped sentences or puncturation misuse may result in inaccurate counts. As a rule of Flow, always separate your words with spaces or line breaks, words separated by puncturation or digits will count as one.

## Development

Flow is using [Preact-js][] a _fast 3kB alternative_ to [React-js][] with the same _modern_ API, bundled by [esbuild][] a _truly fast_ **JavaScript** _bundler and minifier_ that packages up **JavaScript** and **TypeScript** code for distribution to the web. Using [Theme-ui][] the **Design Graph Framework** to provide an opinionated design system paired with [FontAwesome][]’s free **solid** icons. It also makes use of [ZillaSlab][], **Mozilla**’s core typeface and [FiraCode][], a monospaced font containing ligatures for common programming multi-character combinations for a realy exotic typographic experience.

- Run `npm i` in the project directory to install all the dependencies and dev-dependencies;
- Run `npm run build-development` to build for development or `npm run build-production` to build for production;
- Open the `index.html` file in the `build` folder to begin working (you need to refresh the page after each re-build for the changes to take effect);
- When ready run `npm run deploy` to deploy the contents of `build` to gh-pages or `npm run release` to also re-build for production.

## License

It is distributed under the [MIT license][], a short and simple permissive license with conditions _only_ requiring **preservation of copyright and license notices**. Licensed works, modifications, and larger works may be distributed under different terms and without source code.

[slate-js]: https://docs.slatejs.org/
[preact-js]: https://preactjs.com/
[react-js]: https://reactjs.org/
[esbuild]: https://github.com/evanw/esbuild
[theme-ui]: https://theme-ui.com/
[fontawesome]: https://fontawesome.com/
[zillaslab]: https://github.com/mozilla/zilla-slab
[firacode]: https://github.com/tonsky/FiraCode
[mit license]: https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE
