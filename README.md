# Flow

A compact web based rich-text editor that builds on top of [Slate-js](https://docs.slatejs.org/) with powerful, yet simple and accessible editing capabilities. It's using a design system not just for its beautiful **UI** but also for handling efficient and consistent document **styling**, this means that it may _lack_ some editing capabilities of other rich-text editors by design, typographic caracteristics like changing the _font-family_, _font-size_ or _line-height_, theme specific emphasis like changing text and bg colors, however in exchange you get consistent **styling** and possibly good typography across your documents. Please note that It's just a personal project of mine for serious things there are plenty of other more complex, non-opinionated rich-text editors out there that you can use on a daly basis.

## Usage

Use the buttons in the tools section at the top of Flow (the app) or use _keyboard_ sortcuts listed in the table below to toggle _mark-style_ formating like **Bold** or _Italic_ on the selected text, _block-style_ formating however like Paragraphs, Heading types or Aligning don't need selection, just make sure to leave the cursor in the block that needs formating before pushing those buttons or firing shortcuts to toggle the needed styles. Flow (the app) will highlight buttons when their format is active on the selected text or on the block the cursor is in. Flow (the app) has an autosaving feature that saves your documents to your browser's _local-storage_ container which you can access through the developer-tools of your browser.

| Shortcut                | Description                                  |
| ----------------------- | -------------------------------------------- |
| `Ctrl or Cmd + z`       | Undo                                         |
| `Ctrl or Cmd + y`       | Redo                                         |
| `Ctrl or Cmd + c`       | Copy                                         |
| `Ctrl or Cmd + x`       | Cut                                          |
| `Ctrl or Cmd + v`       | Paste                                        |
| `Ctrl or Cmd + p`       | Print                                        |
| `Ctrl or Cmd + b`       | Toggle format on selected text to **Bold**   |
| `Ctrl or Cmd + i`       | Toggle format on selected text to _Italic_   |
| `Ctrl or Cmd + Alt + f` | Toggle fullscreen (expand/compress)          |
| `Ctrl or Cmd + Alt + 0` | Toggle format on block to <p>paragraph</p>   |
| `Ctrl or Cmd + Alt + 1` | Toggle format on block to <h1>heading 1</h1> |
| `Ctrl or Cmd + Alt + 2` | Toggle format on block to <h2>heading 2</h2> |
| `Ctrl or Cmd + Alt + 3` | Toggle format on block to <h3>heading 3</h3> |
| `Ctrl or Cmd + Alt + 4` | Toggle format on block to <h4>heading 4</h4> |
| `Ctrl or Cmd + Alt + 5` | Toggle format on block to <h5>heading 5</h5> |
| `Ctrl or Cmd + Alt + 6` | Toggle format on block to <h6>heading 6</h6> |

## Development

This app is using [Preact-js](https://preactjs.com/) a fast 3kB alternative to [React-js](https://reactjs.org/) with the same _modern_ **API**, bundled by [Parcel-js](https://parceljs.org/) a blazing fast, zero configuration web application bundler and [Theme-ui](https://theme-ui.com/) the Design Graph Framework to provide an opinionated design system paired with [FontAwesome](https://fontawesome.com/)'s **awesome** solid icons.

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
