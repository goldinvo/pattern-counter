
# Pattern Counter

See my [blog post](https://goldinvo.com/2021/07/22/pattern-counter.html) on using this app

An interactive tool for knitters and crocheters that parses/decomposes patterns and keeps track of repeat counts so that it is easier for the user to keep track of their place in a pattern. 

## Syntax

The pattern submitted by the user should follow the proper syntax for the app to function as expected. This syntax is based on how patterns are typically written. Since patterns are not written in a standardized way, syntax rules must be minimal and flexible so that the user has to modify their pattern as little as possible to use the pattern counter.

### Tokens / Delimiters

- Instruction Number: `5)`,  `6.`
- Information/Comments: `(30)`, `(You should have 3 stitches on the needle)`, `()`
- Number: `1`, `2`
- String: `sc 3`, `m1r`, `make a magic loop`
- Open Parenthesis: `(`, `{`, `[`
- Closed Parenthesis: `)` `}`, `]`
- Multipliers: `*`
- Seperators: `.`, `,`
- Line Breaks: `↵`

### Usage

The pattern input by the user should be a sequence of instructions separated by one or more line breaks. Instructions are displayed one at a time, and are composed of the instruction number, comments, sequences of strings, and parenthesis/numbers/multipliers used to denote repeats. 

For example:    

    26. CTC, INC 10, CTB, INC * 20 (60)↵    
    27. CTC, (SC 9, INC) * 2, CTB, (SC 9, INC) * 4  (66)↵    
    ↵    
    28. (CTC, SC 23, CTB, SC 43) * 2 (66)↵    
    39. (CTC, SC 24, CTB, SC 42) * 2 (66)    

Instruction Numbers and Information/Comments are ignored by the application, but are kept in to be displayed as useful information for the user.    
Instruction numbers are optional, and may appear only at the beginning of an instruction if used. 

Strings (which act as a single step when working in a pattern are separated by separators, typically commas, or other tokens. They may consist of numbers but they cannot be only a number.    
- A single string is not wrapped in parenthesis. `(things like this)` are interpreted as a comment.
- A sequence of strings wrapped in parenthesis `(like, this, one)` are interpreted as a repeat sequence.
  - if followed by a multiplier and then by a number `(like, this) * 3`, the sequence will be repeated 3 times as the user steps through them
  - if not followed by both a multiplier and a number, the sequence will repeat indefinitely until the user clicks the "exit repeat" button. This is to account for conditional repeats, such as "until you reach the end of the row" while still being able to keep track of the number of repeats you have made.

## Application Structure

Notable files:
- Components:
  - `App.js`: Maintains and handles state related to pattern counts and the index of the pattern where the user currently is.
  - `InstructionView.js`, `InstructionText.js`: Handles how the data related to the current state is intelligently displayed for the user.
  - `ManualCounter.js`: Independent unit for if the user wants to count something else.
  - `Counter.js`: Displays the counts. Accepts user inputs to quickly change the current count.
- Other:
  - `PatternLexer.js`: A module of functions for tokenization of user input and light validation of syntax.
  - `Token.js`: Interface for using token objects that compose a pattern.

---

run `npm run deploy` to host on github pages

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
