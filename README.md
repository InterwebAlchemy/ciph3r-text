# Ciph3rText

A React Component that animates transforming a string of text:

- `encode`: slowly scramble the text by replacing characters
- `decode`: start with scrambed text and unscramble it by replacing characters and slowly revealing the text
- `transform`: convert one string into another by padding it with random characters or removing extra characters while slowly revealing the target text

## Getting Started

Install the package:

```sh
# use npm, bun, yarn, pnpm ,etc.
npm install @InterwebAlchemy/ciph3r-text
```

Import the package:

```tsx
import Ciph3rText from "@InterwebAlchemy/ciph3r-text";
```

Render the Component:

```tsx
<Ciph3rText defaultText="https://interwebalchemy.com/" action="decode" />
```

## Configuration

There are some configuration options you can use:

## Examples

- [Interweb.WTF](https://www.interweb.wtf/): watch the example WTF Link on the homepage reveal itself
- [Interweb.WTF URL Expander](https://www.interweb.wtf/is/): enter `https://bit.ly/prompt-injection-guide` into the input and hit <kbd>Enter</kbd> and watch the URL transform
- [Interweb.WTF URL Cleaner](https://www.interweb.wtf/clean/): enter `https://interwebalchemy.com/posts/building-a-chess-tutor?utm_source=interweb.wtf&utm_campaign=docs` into the input and hit <kbd>Enter</kbd> and watch the URL transform
- [Collabodoro](https://collabodoro.work/): watch the logo when you start the timer without hosting or joining a collaboration session

**Note**: The Interweb.WTF examples work with other shortlinks and URLs with tracking parameters in them, these are just example inputs you can use.
