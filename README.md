# flow

A compact web based rich-text editor builds on top of [Slate-js](https://docs.slatejs.org/) to produce documents in *"standardized"* format with powerful editing capabilities all thanks to the above mentioned library.

By *"standardized"* I mean its using [bootstrap](https://getbootstrap.com/)'s design system not just for its beautiful **UI** but also for handling eficient and consistent document **formating and styling**, this means that it may *lack* some editing capabilities of other rich-text editors by design, like changing the *font-family* or *font-size*, (for that you have some heading style options with predefined sizes, and a code formating option for changing to a monospaced font family) however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other editors out there you can try out.

## Usage

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

After you run `npm install` in the project directory, these commands will become available:

| Command                          | Description                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run develop` or `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000).        |
| `npm run build`                  | Builds the app for production to the `build` folder.                                       |
| `npm run deploy`                 | Deploys the contents of the `build` folder to [Github Pages](https://pages.github.com/)    |
| `npm run release`                | Builds the app for production then deploys it to [Github Pages](https://pages.github.com/) |

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
