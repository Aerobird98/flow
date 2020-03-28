# flow

A compact web based rich-text editor builds on top of [Slate-js](https://docs.slatejs.org/) to produce documents in *"standardized"* format with powerful editing capabilities all thanks to the above mentioned library.

By *"standardized"* I mean its using [bootstrap](https://getbootstrap.com/)'s design system not just for its beautiful **UI** but also for handling eficient and consistent document **formating and styling**, this means that it may *lack* some editing capabilities of other rich-text editors by design, like changing the *font-family* or *font-size*, (for that you have some heading style options with predefined sizes, and a code formating option for changing to a monospaced font family) however in exchange you get consistent styling and good typography across your documents, if that is not for you, there are plenty of other editors out there you can try out.

## Usage

You can use the buttons in the tools section at the top of the page or use *keyboard* sortcuts listed in a table below. It has an autosaving feature that saves your documents to your browser's *local-storage* container.

| Command     | Description                          |
| ----------- | ------------------------------------ |
| `Ctrl + z`  | undo                                 |
| `Ctrl + y`  | redo                                 |
| `Ctrl + c`  | copy                                 |
| `Ctrl + x`  | cut                                  |
| `Ctrl + v`  | paste                                |
| `Ctrl + b`  | Format selection to bold             |
| `Ctrl + i`  | Format selection to italic           |
| `Ctrl + u`  | Format selection to underline        |
| `Ctrl + ~`  | Format selection to code (monospace) |

I am using an **Icon Library** namely [FontAwesome](https://fontawesome.com/) to represent common formating options and functionality in the tools section, however if you are uncertain in the meaning of some of the icons (which hopfuly wont happen as freqently since these icons are **AWESOME**) just hover over one of the buttons to get more information on its functionality in question.

At the bottom of the page you can see a neat status line providing information about the current selection, word and character count and other statistics of the currently edited document.

## Development

In the project directory, you can run:

### `npm start`

Runs the editor in development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the developer console.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your editor is ready to be deployed!

### `npm run deploy`

After you ran `npm run build` you can deploy the contents of the `build` folder to [Github Pages](https://pages.github.com/) with this command. <br />
Make sure to actualy run `npm run build` and the `build` folder does exists before running this command.

### `npm run release`

Builds the app for production to the `build` folder, just like `npm run build` would.<br />
Then deploys it to [Github Pages](https://pages.github.com/) for you in one simple command.

## License

[MIT](https://raw.githubusercontent.com/Aerobird98/flow/master/LICENSE) license, a short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
