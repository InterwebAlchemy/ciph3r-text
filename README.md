# Ciph3rText

https://github.com/user-attachments/assets/cac34beb-8eeb-4936-852f-ed9778ec4a46

**Note**: You can find some demo videos of this in action in the [examples directory](./examples).

A React Component that animates transforming a string of text:

- `encode`: slowly scramble the text by replacing characters
- `decode`: start with scrambed text and unscramble it by replacing characters and slowly revealing the text
- `transform`: convert one string into another by padding it with random characters or removing extra characters while slowly revealing the target text

## Getting Started

Install the package:

```sh
# use npm, bun, yarn, pnpm, etc.
npm install @interwebalchemy/ciph3r-text
```

```
bun add @InterwebAlchemy/ciph3r-text
```

Import the package:

```tsx
import Ciph3rText from "@interwebalchemy/ciph3r-text";
```

Render the Component:

```tsx
<Ciph3rText defaultText="https://interwebalchemy.com/" action="decode" />
```

## Configuration

There are some configuration options you can use:

<!-- prettier-ignore -->
| **Property** | **Description** | **Type** | **Default** |
| -----------  | --------------- | -------- | ----------- |
| `defaultText` **required** | the text to display during server rendering, after decoding, or before encoding or transforming | `string` | `undefined` |
| `action` | controls whether the text is `encoded`, `decoded`, or `transformed` | `"encode"` | `"decode"`, `"endcode"`, or `"transform"` |
| `targetText` *required if `action="transform"`* | the text to transform into when using `action="transform"` | `string` | `undefined` |
| `onFinish` | callback to execute when the `defaultText` has ben fully decoded, encoded, or transformed | `() => {}` | `undefined` |
| `iterationSpeed` | how frequently the logic to scramble characters executes | `number` | `120`; `150` (`transform`) |
| `maxIterations` | how many times the logic to scramble/unscramble characters can run | `number` | `36`; `54` (`transform`) |
| `characters` | a limited string of characters that you want to use in the effect | `string` | all English alphanumeric characters and most symbols on a standard US keyboard |
| `additionalCharacters` | an optional string of characters that you want to use in addition to the `characters` | `string` | `""` |

## Examples

- [Interweb.WTF](https://www.interweb.wtf/): watch the example WTF Link on the homepage reveal itself
- [Interweb.WTF URL Expander](https://www.interweb.wtf/is/): enter `https://bit.ly/prompt-injection-guide` into the input and hit <kbd>Enter</kbd> and watch the URL transform
- [Interweb.WTF URL Cleaner](https://www.interweb.wtf/clean/): enter `https://interwebalchemy.com/posts/building-a-chess-tutor?utm_source=interweb.wtf&utm_campaign=docs` into the input and hit <kbd>Enter</kbd> and watch the URL transform
- [Collabodoro](https://collabodoro.work/): watch the logo when you start the timer without hosting or joining a collaboration session

**Note**: The Interweb.WTF examples work with other shortlinks and URLs with tracking parameters in them, these are just example inputs you can use.
