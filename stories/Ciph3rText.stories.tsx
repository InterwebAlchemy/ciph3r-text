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
      options: ["decode", "encode", "transform"],
    },
    iterationSpeed: {
      control: "number",
      defaultValue: DEFAULT_SPEED,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- this is a story
      min: 1,
    },
    maxIterations: {
      control: "number",
      defaultValue: DEFAULT_MAX_ITERATIONS,
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- this is a story
      min: 1,
    },
    targetText: {
      control: "text",
    },
    defaultText: {
      control: "text",
      defaultValue: "Hello, world!",
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

export const IterationSpeed: Story = {
  args: {
    ...Primary.args,
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- this is a story
    iterationSpeed: 300,
  },
};

export const MaxIterations: Story = {
  args: {
    ...Primary.args,
    defaultText:
      "This is a much longer string that we're going to use to make it easier to see that the max iterations can go for quite a while with longer texts.",
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- this is a story
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
