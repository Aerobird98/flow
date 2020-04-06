# Flow

A compact web based rich-text editor that builds on top of [Slate-js](https://docs.slatejs.org/) with powerful, yet simple and accessible editing capabilities.

Flow (the app) is a _"standardized"_ or heavily _opinionated_ tool and by that I mean its using a design system not just for its beautiful **UI** but also for handling eficient and consistent document **formating and styling**, this means that it may _lack_ some editing capabilities of other rich-text editors by design, like changing the _font-family_ or _font-size_, (for that you have some heading style options with predefined sizes, and a code formating option for changing to a monospaced font family) however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other non-opinionated rich-text editors out there you can try out.

## Usage

Use the buttons in the tools section at the top of the app or use _keyboard_ sortcuts listed in the table below to toggle _mark-style_ formating like **Bold**, _Italic_, <u>Underline</u>, ~~Strikethrough~~, or `code` on the selected text, _block-style_ formating however like Paragraphs and Heading types or Aligning don't need selection, just make sure to leave the cursor in the block that needs formating before pushing those buttons to toggle the needed styles. Flow (the app) will highlight buttons when their format is active on the selected text or on the block the cursor is in.

The editor has an autosaving feature that saves your documents to your browser's _local-storage_ container. If you are done editing your document, use your browser's built-in printing capabilities (like print-to-pdf) to produce a print with customized margins, headers, footers and the like through the aformentioned printing feature's custom parameters. Please note that Flow (the app) don't have any defaults for printing margins and other options, you **MUST** rely on your browser for that.

| Shortcut         | Description                                  |
| ---------------- | -------------------------------------------- |
| `Ctrl + z`       | Undo                                         |
| `Ctrl + y`       | Redo                                         |
| `Ctrl + c`       | Copy                                         |
| `Ctrl + x`       | Cut                                          |
| `Ctrl + v`       | Paste                                        |
| `Ctrl + Alt + 0` | Format block type to be a <p>paragraph</p>   |
| `Ctrl + Alt + 1` | Format block type to be a <h1>heading 1</h1> |
| `Ctrl + Alt + 2` | Format block type to be a <h2>heading 2</h2> |
| `Ctrl + Alt + 3` | Format block type to be a <h3>heading 3</h3> |
| `Ctrl + Alt + 4` | Format block type to be a <h4>heading 4</h4> |
| `Ctrl + Alt + 5` | Format block type to be a <h5>heading 5</h5> |
| `Ctrl + Alt + 6` | Format block type to be a <h6>heading 6</h6> |
| `Ctrl + b`       | Format selection to **Bold**                 |
| `Ctrl + i`       | Format selection to _Italic_                 |
| `Ctrl + u`       | Format selection to <u>Underline</u>         |
| `Ctrl + s`       | Format selection to ~~Strikethrough~~        |
| `Ctrl + ~`       | Format selection to `Code` (monospace)       |

## Development

This app is using [Preact-js](https://preactjs.com/) a fast 3kB alternative to [React-js](https://reactjs.org/) with the same _modern_ **API**, bundled by [Parcel-js](https://parceljs.org/) a blazing fast, zero configuration web application bundler and currently using [Bootstrap](https://getbootstrap.com/) as an opinionated design system to build upon.

Run `npm install` in the project directory to install all the dependencies and dev-tools so these commands will become available:

| Command           | Description                                                                                                      |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `npm run devel`   | Builds the app for development to the `dist` folder and serves it over [localhost:3000](http://localhost:3000/). |
| `npm run clean`   | Clean the contents of the `dist` folder.                                                                         |
| `npm run build`   | Builds the app for production to the `dist` folder without deploying it.                                         |
| `npm run deploy`  | Deploys the contents of the `dist` folder to [Github Pages](https://pages.github.com/)                           |
| `npm run release` | Builds and Deploys the contents of the `dist` folder to [Github Pages](https://pages.github.com/)                |

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
