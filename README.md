# Flow

A compact web based rich-text editor that builds on top of [Slate-js](https://docs.slatejs.org/) with powerful, yet simple and accessible editing capabilities. It's using a design system not just for its beautiful **UI** but also for handling efficient and consistent document **styling**, this means that it may _lack_ some editing capabilities of other rich-text editors by design, typographic caracteristics like changing the _font-family_, _font-size_ or _line-height_, theme specific emphasis like changing text and bg colors, however in exchange you get consistent **styling** and possibly good typography across your documents.

This app is using [Preact-js](https://preactjs.com/) a fast 3kB alternative to [React-js](https://reactjs.org/) with the same _modern_ **API**, bundled by [esbuild](https://github.com/evanw/esbuild) a _truly fast_ **JavaScript** bundler and minifier that packages up **JavaScript** and **TypeScript** code for distribution on the web. Using [Theme-ui](https://theme-ui.com/) the Design Graph Framework to provide an opinionated design system paired with [FontAwesome](https://fontawesome.com/)'s **awesome** free solid icons (I wanted to use pro, but sadly that's not alowed for open-source projects...).

## Usage

Use the buttons in the tools section at the top of Flow (the app) or use _keyboard_ sortcuts listed in the table below to toggle _mark-style_ formating like **Bold** or _Italic_ on the selected text, _block-style_ formating however like Paragraphs, Heading types or Aligning don't need selection, just make sure to leave the cursor in the block that needs formating before pushing those buttons or firing shortcuts to toggle the needed styles. Flow (the app) will highlight buttons when their format is active on the selected text or on the block the cursor is in. Flow (the app) has an autosaving feature that saves your currently edited document to your browser's _local-storage_ container which you can access through the developer-tools of your browser.

| Shortcut          | Description                                |
| ----------------- | ------------------------------------------ |
| `Ctrl or Cmd + z` | Undo                                       |
| `Ctrl or Cmd + y` | Redo                                       |
| `Ctrl or Cmd + c` | Copy                                       |
| `Ctrl or Cmd + x` | Cut                                        |
| `Ctrl or Cmd + v` | Paste                                      |
| `Ctrl or Cmd + p` | Print                                      |
| `Ctrl or Cmd + b` | Toggle format on selected text to **Bold** |
| `Ctrl or Cmd + i` | Toggle format on selected text to _Italic_ |

## Development

`npm start` builds for development, open the `index.html` file in `dist` to begin working (you need to refresh the page after each re-build for the changes to take effect).

1. Run `npm install` in the project directory to install all the dependencies and dev-dependencies;
2. Run `npm run build-development` to build for development or `npm run build-production` to build for production;
3. Open the `index.html` file in `dist` to begin working (you need to refresh the page after each re-build for the changes to take effect);
4. When ready run `npm run release` to build for production and deploy to gh-pages.

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
