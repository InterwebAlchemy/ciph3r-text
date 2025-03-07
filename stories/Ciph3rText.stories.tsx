import type { Meta, StoryObj } from "@storybook/react";

import Ciph3rText from "../src/Ciph3rText";
import {
  DEFAULT_SPEED,
  DEFAULT_MAX_ITERATIONS,
} from "../src/Ciph3rText/constants";
const meta: Meta<typeof Ciph3rText> = {
  component: Ciph3rText,
  title: "Ciph3rText",
  argTypes: {
    action: {
      control: "select",
      options: ["decode", "encode", "transform", "scramble"],
    },
    iterationSpeed: {
      control: "number",
      defaultValue: DEFAULT_SPEED,
      min: 1,
    },
    maxIterations: {
      control: "number",
      defaultValue: DEFAULT_MAX_ITERATIONS,
      min: 1,
    },
    targetText: {
      control: "text",
    },
    defaultText: {
      control: "text",
      defaultValue: "Hello, world!",
    },
    useMatrixCharacterSet: {
      control: "boolean",
      defaultValue: false,
    },
    includeCursedCharacters: {
      control: "boolean",
      defaultValue: false,
    },
    additionalCharactersToInclude: {
      control: "text",
      defaultValue: "",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Ciph3rText>;

export const Primary: Story = {
  args: {
    defaultText: "Hello, world!",
  },
};

export const Scramble: Story = {
  args: {
    ...Primary.args,
    action: "scramble",
    defaultText: "Hello, world!",
  },
};

export const ScrambleWithMatrixCharacters: Story = {
  args: {
    ...Primary.args,
    action: "scramble",
    defaultText: "Hello, world!",
    useMatrixCharacterSet: true,
  },
};

export const ScrambleWithCursedCharacters: Story = {
  args: {
    ...Primary.args,
    action: "scramble",
    defaultText: "Hello, world!",
    includeCursedCharacters: true,
  },
};

export const ScrambleWithMatrixCharactersAndCursedCharacters: Story = {
  args: {
    ...Primary.args,
    action: "scramble",
    defaultText: "Hello, world!",
    useMatrixCharacterSet: true,
    includeCursedCharacters: true,
  },
};

export const Decode: Story = {
  args: {
    ...Primary.args,
    action: "decode",
  },
};

export const Encode: Story = {
  args: {
    ...Primary.args,
    action: "encode",
  },
};

export const Transform: Story = {
  args: {
    ...Primary.args,
    action: "transform",
    targetText: "Goodbye, human!",
  },
};

export const TransformSameText: Story = {
  args: {
    ...Primary.args,
    action: "transform",
    targetText: "Hello, world!",
    defaultText: "Hello, world!",
  },
};

export const IterationSpeed: Story = {
  args: {
    ...Primary.args,
    iterationSpeed: 300,
  },
};

export const MaxIterations: Story = {
  args: {
    ...Primary.args,
    defaultText:
      "This is a much longer string that we're going to use to make it easier to see that the max iterations can go for quite a while with longer texts.",
    maxIterations: 1000,
  },
};

export const OnFinishCallback: Story = {
  args: {
    ...Primary.args,
    onFinish: () => {
      // eslint-disable-next-line no-alert -- this is a story
      alert("Finished!");
    },
  },
};

export const TransformNoTargetText: Story = {
  args: {
    ...Primary.args,
    action: "transform",
    targetText: "",
  },
};
