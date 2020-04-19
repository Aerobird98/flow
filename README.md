# Flow

A compact web based rich-text editor that builds on top of [Slate-js](https://docs.slatejs.org/) with powerful, yet simple and accessible editing capabilities.

Flow (the app) is a _"standardized"_ or heavily _opinionated_ tool and by that I mean its using a design system not just for its beautiful **UI** but also for handling efficient and consistent document **formating and styling**, this means that it may _lack_ some editing capabilities of other rich-text editors by design, like changing the _font-family_ or _font-size_, however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other non-opinionated rich-text editors out there that you can try out.

## Usage

Use the buttons in the tools section at the top of the app or use _keyboard_ sortcuts listed in the table below when text is selected to toggle _mark-style_ formating like **Bold** or _Italic_ on the selected text, _block-style_ formating however like Paragraphs and Heading types or Aligning don't need selection, just make sure to leave the cursor in the block that needs formating before pushing those buttons to toggle the needed styles. Flow (the app) will highlight buttons when their format is active on the selected text or on the block the cursor is in. The editor has an autosaving feature that saves your documents to your browser's _local-storage_ container which you can access through the developer-tools of your browser.

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
| `Ctrl or Cmd + Alt + f` | toggle fullscreen (expand/compress)          |
| `Ctrl or Cmd + Alt + 0` | Toggle format on block to <p>paragraph</p>   |
| `Ctrl or Cmd + Alt + 1` | Toggle format on block to <h1>heading 1</h1> |
| `Ctrl or Cmd + Alt + 2` | Toggle format on block to <h2>heading 2</h2> |
| `Ctrl or Cmd + Alt + 3` | Toggle format on block to <h3>heading 3</h3> |
| `Ctrl or Cmd + Alt + 4` | Toggle format on block to <h4>heading 4</h4> |
| `Ctrl or Cmd + Alt + 5` | Toggle format on block to <h5>heading 5</h5> |
| `Ctrl or Cmd + Alt + 6` | Toggle format on block to <h6>heading 6</h6> |

## Development

This app is using [Preact-js](https://preactjs.com/) a fast 3kB alternative to [React-js](https://reactjs.org/) with the same _modern_ **API**, bundled by [Parcel-js](https://parceljs.org/) a blazing fast, zero configuration web application bundler and currently using [Theme-ui](https://theme-ui.com/) backed opinionated design system to build upon paired with [FontAwesome](https://fontawesome.com/)'s **awesome** icons.

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
