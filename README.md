# flow

A compact web based rich-text editor that builds on top of [Slate-js](https://docs.slatejs.org/) and [React-js](https://reactjs.org/) with powerful, yet simple and accessible editing capabilities.

It is _"standardized"_ or heavily _opinionated_ and by that I mean its using a design system not just for its beautiful **UI** but also for handling eficient and consistent document **formating and styling**, this means that it may _lack_ some editing capabilities of other rich-text editors by design, like changing the _font-family_ or _font-size_, (for that you have some heading style options with predefined sizes, and a code formating option for changing to a monospaced font family) however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other non-opinionated rich-text editors out there you can try out.

## Usage

Use the buttons in the tools section at the top of the app or use _keyboard_ sortcuts listed in the table below. The editor has an autosaving feature that saves your documents to your browser's _local-storage_ container, you can access it trough the **UI** by pressing the _server_ button at the top left of the tools section.

| Shortcut   | Description                          |
| ---------- | ------------------------------------ |
| `Ctrl + z` | undo                                 |
| `Ctrl + y` | redo                                 |
| `Ctrl + c` | copy                                 |
| `Ctrl + x` | cut                                  |
| `Ctrl + v` | paste                                |
| `Ctrl + b` | Format selection to bold             |
| `Ctrl + i` | Format selection to italic           |
| `Ctrl + u` | Format selection to underline        |
| `Ctrl + s` | Format selection to strikethrough    |
| `Ctrl + ~` | Format selection to code (monospace) |

## Development

This app is bundled by [Parcel-js](https://parceljs.org/) a blazing fast, zero configuration web application bundler. Run `npm install` in the project directory to install all the dependencies and dev-tools so these commands will become available:

| Command          | Description                                                                             |
| ---------------- | --------------------------------------------------------------------------------------- |
| `npm run dev`    | Builds the app for development to the `dev` folder and serves it over `localhost:3000`. |
| `npm run build`  | Builds the app for production to the `dist` folder, but won't deploy it.                |
| `npm run deploy` | Deploys the contents of the `dist` folder to [Github Pages](https://pages.github.com/)  |

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
