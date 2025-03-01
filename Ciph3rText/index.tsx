import { useCallback, useEffect, useState } from "react";
import { useInterval, useIsClient } from "usehooks-ts";

import {
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_SPEED,
  MAXIMUM_CHARACTERS_TO_REVEAL,
  MINIMUM_CHARACTERS_TO_REVEAL,
  MAXIMUM_CHARACTERS_TO_REMOVE,
  MINIMUM_CHARACTERS_TO_REMOVE,
  MAXIMUM_CHARACTERS_TO_ADD,
  MINIMUM_CHARACTERS_TO_ADD,
} from "./constants";

import type { Ciph3rTextProps } from "./types";
import { getRandomCharacter, randomizeText, revealCharacters } from "./utils";

/**
 * Ciph3rText is a React component that transforms text between encode, decode, and transform actions.
 *
 * @param props - The component props
 * @param props.action - The style of transformation to perform (encode, decode, or transform)
 * @param props.defaultText - The default text to display
 * @param props.iterationSpeed - The speed of the transformation
 * @param props.maxIterations - The maximum number of iterations
 * @param props.onFinish - The callback function to call when the transformation is finished
 * @param props.targetText - The target text to transform to when props.action is "transform"
 * @returns A React.Fragment animating the transformed text
 */

/* eslint-disable-next-line complexity -- due to React Component and hooks being kind of complex */
export default function Ciph3rText({
  defaultText,
  iterationSpeed: iterationSpeedProp,
  maxIterations: maxIterationsProp,
  onFinish,
  targetText = "",
  action = "decode",
}: React.PropsWithoutRef<Ciph3rTextProps>): React.ReactElement {
  const isClient = useIsClient();

  // throw an error if the default text is not provided
  if (typeof defaultText === "undefined") {
    throw new Error("defaultText is required");
  }

  // attempt to convert the default text to a string if it is not already
  if (typeof defaultText !== "string") {
    try {
      defaultText = String(defaultText);
    } catch (error) {
      // if we couldn't turn it into a string, throw an error
      throw new Error("defaultText must be a string");
    }
  }

  // throw an error if the action is "transform" and no target text is provided
  if (
    action === "transform" &&
    (typeof targetText === "undefined" || targetText === "")
  ) {
    throw new Error('targetText is required for action "transform"');
  }

  // set the iteration speed and max iterations to the default values if they are not provided
  // we do this here because we need to base the default values on the action type
  const iterationSpeed = iterationSpeedProp ?? DEFAULT_SPEED[action];
  const maxIterations = maxIterationsProp ?? DEFAULT_MAX_ITERATIONS[action];

  /**
   * Formats the default text by converting it to a string of random characters if the action is "decode"
   *
   * @remarks
   * This is only used to set the initial state of the formatted text, so we are wrapping it in a useCallback
   * because we'll only need to run it if the action type changes or new defaultText is provided.
   *
   * @returns The formatted text
   */
  const formatDefaultText = useCallback(
    (): string =>
      action === "decode" ? randomizeText(defaultText) : defaultText,
    [action, defaultText],
  );

  const [isDone, setIsDone] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- counters start at 0 */
  const [iterations, setIterations] = useState(0);
  const [formattedText, setFormattedText] =
    useState<string>(formatDefaultText());

  /**
   * Converts input text to target text by padding with random characters or deleting
   * characters as needed and randomly revealing 1 to 5 characters up to the max iterations
   *
   * @param text The input text to transform
   * @returns The transformed text with characters added or removed
   */
  const transformText = (text: string): string => {
    if (text === targetText) {
      setIsDone(true);

      return text;
    }

    let transformedText = text;

    // weigh the amount of characters to reveal and add/remove based on the difference between the text lengths
    // higher discrepancies lead to higher weights
    const weight =
      Math.abs(text.length - targetText.length) / targetText.length;

    if (text.length > targetText.length) {
      // remove a random number of characters less than the difference between the text lengths
      // from the end of the string; clamped between 1 and 5
      const maxNumberOfCharactersToRemove = Math.min(
        Math.max(MINIMUM_CHARACTERS_TO_REMOVE, text.length - targetText.length),
        MAXIMUM_CHARACTERS_TO_REMOVE,
      );

      // apply the weight to the max number of characters to remove
      const weightedMaxNumberOfCharactersToRemove = Math.floor(
        maxNumberOfCharactersToRemove * weight,
      );

      let numberOfCharactersToRemove =
        Math.floor(Math.random() * weightedMaxNumberOfCharactersToRemove) +
        MINIMUM_CHARACTERS_TO_REMOVE;

      // fully cut the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToRemove = text.length - targetText.length;
      }

      // remove the characters from the end of the string
      transformedText = transformedText.slice(
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- start and end of string are 0 and -1 */
        0,
        /* eslint-disable-next-line @typescript-eslint/no-magic-numbers -- start and end of string are 0 and -1 */
        -1 * numberOfCharactersToRemove,
      );
    } else if (text.length < targetText.length) {
      // add a random number of characters less than the difference between the text lengths
      // to the end of the string; clamped between 1 and 5
      const maxNumberOfCharactersToAdd = Math.min(
        Math.max(MINIMUM_CHARACTERS_TO_ADD, targetText.length - text.length),
        MAXIMUM_CHARACTERS_TO_ADD,
      );

      // apply the weight to the max number of characters to add
      const weightedMaxNumberOfCharactersToAdd = Math.floor(
        maxNumberOfCharactersToAdd * weight,
      );

      let numberOfCharactersToAdd =
        Math.floor(Math.random() * weightedMaxNumberOfCharactersToAdd) +
        MINIMUM_CHARACTERS_TO_ADD;

      // fully pad the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToAdd = targetText.length - text.length;
      }

      // add the characters to the end of the string
      for (let i = 0; i < numberOfCharactersToAdd; i++) {
        transformedText += getRandomCharacter();
      }
    }

    // choose random number of characters to reveal between 1 and 3
    const numberOfCharactersToReveal =
      Math.floor(Math.random() * MAXIMUM_CHARACTERS_TO_REVEAL) +
      MINIMUM_CHARACTERS_TO_REVEAL;

    // apply the weight to the number of characters to reveal
    const weightedNumberOfCharactersToReveal = Math.floor(
      numberOfCharactersToReveal * weight,
    );

    // Use the new revealCharacters utility function
    return revealCharacters({
      action,
      sourceText: transformedText,
      targetText,
      maxCharactersToReveal: weightedNumberOfCharactersToReveal,
      currentIteration: iterations,
      maxIterations,
    });
  };

  /**
   * Decodes the input text by revealing 1 to 5 random characters at a time up to the max iterations
   *
   * @param text The input text to decode
   * @returns The decoded text with characters revealed
   */
  const decodeText = (text: string): string => {
    if (text === defaultText) {
      setIsDone(true);

      return text;
    }

    // choose random number of characters to reveal between 1 and 5
    const numberOfCharactersToReveal =
      Math.floor(Math.random() * MAXIMUM_CHARACTERS_TO_REVEAL) +
      MINIMUM_CHARACTERS_TO_REVEAL;

    // Use the new revealCharacters utility function
    return revealCharacters({
      action,
      sourceText: text,
      targetText: defaultText,
      maxCharactersToReveal: numberOfCharactersToReveal,
      currentIteration: iterations,
      maxIterations,
    });
  };

  // this hook will call the onFinish callback if one was supplied
  useEffect(() => {
    if (isDone) {
      // this just gives us a shortcut for checking if the callback is defined and a function we can call
      onFinish?.();
    }
  }, [isDone]);

  // this interval will run while we're animating the text transformation
  useInterval(
    () => {
      setIterations((previousIterations) => previousIterations++);

      setFormattedText((previousText) => {
        switch (action) {
          case "decode":
            return decodeText(previousText);
          case "transform":
            return transformText(previousText);
          default:
            return previousText;
        }
      });
    },
    action === "decode" || action === "transform"
      ? !isDone
        ? iterationSpeed
        : null
      : null,
  );

  /**
   * Renders the formatted text or the target text if the action is "transform"
   *
   * @remarks
   * This component checks for isClient and renders the unformatted, original text if this
   * isn't running in the browser. This is useful for server-side rendering and generating
   * SEO-friendly previews of the content - leaving the transformation animation to the browser.
   *
   * @returns The rendered text as a React.Fragment
   */
  return (
    <>
      {isClient
        ? formattedText
        : action === "transform"
          ? targetText
          : defaultText}
    </>
  );
}
