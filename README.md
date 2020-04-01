# flow

A compact web based rich-text editor builds on top of [Slate-js](https://docs.slatejs.org/) and [React-js](https://reactjs.org/) to produce documents in *"standardized"* format with powerful, yet simple and accessible editing capabilities.

## Usage

By *"standardized"* I mean its using [bootstrap](https://getbootstrap.com/)'s design system not just for its beautiful **UI** but also for handling eficient and consistent document **formating and styling**, this means that it may *lack* some editing capabilities of other rich-text editors by design, like changing the *font-family* or *font-size*, (for that you have some heading style options with predefined sizes, and a code formating option for changing to a monospaced font family) however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other non-opinionated rich-text editors out there you can try out.

You can use the buttons in the tools section at the top of the app or use *keyboard* sortcuts listed in the table below. It has an autosaving feature that saves your documents to your browser's *local-storage* container, you can access it trough a the **UI** by pressing the *server* button at the top left of the tools section.

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

| Command         | Description                                                                               |
| --------------- | ----------------------------------------------------------------------------------------- |
| `npm run dev`   | Builds the app for development to the `dev` folder and serves it over `localhost:3000`.   |
| `npm run build` | Builds the app for production to the `dist` folder, but won't deploy it.                  |
| `npm run deploy`| Builds the app for production and deploys it to [Github Pages](https://pages.github.com/) |

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
