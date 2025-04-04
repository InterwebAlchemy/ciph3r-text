import React, { useEffect, useMemo, useState } from "react";
import { useInterval, useIsClient } from "usehooks-ts";

import {
  ACTIONS,
  BASE_PRINTABLE_CHARACTERS,
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_SPEED,
} from "./constants";

import type { Ciph3rTextProps } from "./types";

import {
  calculateNumberOfCharactersToAdd,
  calculateNumberOfCharactersToEncode,
  calculateNumberOfCharactersToRemove,
  calculateNumberOfCharactersToReveal,
  calculateNumberOfCharactersToScramble,
  getRandomCharacter,
  randomizeText,
  revealCharacters,
  scrambleCharacters,
} from "./utils";

export type { Ciph3rTextProps };

export {
  ACTIONS,
  BASE_PRINTABLE_CHARACTERS,
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_SPEED,
};

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
// eslint-disable-next-line complexity -- this is a complex component
const Ciph3rText = ({
  defaultText,
  onFinish,
  iterationSpeed: iterationSpeedProp,
  maxIterations: maxIterationsProp,
  targetText = "",
  action = "decode",
  characters = BASE_PRINTABLE_CHARACTERS,
  additionalCharactersToInclude = "",
  ref = null,
  ...restProps
}: React.ComponentPropsWithRef<"span"> & Ciph3rTextProps): React.ReactElement<
  React.ComponentPropsWithRef<"span">
> => {
  const isClient = useIsClient();

  const characterSet = useMemo(
    (): string => (characters += additionalCharactersToInclude),
    [characters, additionalCharactersToInclude],
  );

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- we're just ensuring we don't end up with a null
    (typeof targetText === "undefined" || targetText === null)
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
  const formatDefaultText = (text: string): string =>
    action === "decode" ? randomizeText(text, characterSet) : text;

  const [isDone, setIsDone] = useState(false);
  const [iterations, setIterations] = useState(0);
  const [formattedText, setFormattedText] = useState<string>(
    formatDefaultText(defaultText),
  );

  /**
   * Scrambles the input text by randomly shuffling the characters
   *
   * @param text The input text to scramble
   * @returns The scrambled text
   */
  const scrambleText = (text: string): string => {
    const numberOfCharactersToScramble =
      calculateNumberOfCharactersToScramble(defaultText);

    // Use the new revealCharacters utility function
    return scrambleCharacters({
      text,
      characterSet,
      maxCharactersToScramble: numberOfCharactersToScramble,
    });
  };

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
      let numberOfCharactersToRemove = calculateNumberOfCharactersToRemove(
        defaultText,
        weight,
      );

      // fully cut the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToRemove = text.length - targetText.length;
      }

      // remove the characters from the end of the string
      transformedText = transformedText.slice(
        0,
        -1 * numberOfCharactersToRemove,
      );
    } else if (text.length < targetText.length) {
      // add a random number of characters less than the difference between the text lengths
      // to the end of the string; clamped between 1 and 5
      let numberOfCharactersToAdd = calculateNumberOfCharactersToAdd(
        defaultText,
        weight,
      );

      // fully pad the string if we have reached the max iterations
      if (iterations >= maxIterations) {
        numberOfCharactersToAdd = targetText.length - text.length;
      }

      // add the characters to the end of the string
      for (let i = 0; i < numberOfCharactersToAdd; i++) {
        transformedText += getRandomCharacter(characterSet);
      }
    }

    // choose random number of characters to reveal between 1 and 3
    const numberOfCharactersToReveal = calculateNumberOfCharactersToReveal(
      defaultText,
      weight,
    );

    // Use the new revealCharacters utility function
    return revealCharacters({
      action,
      sourceText: transformedText,
      targetText,
      maxCharactersToReveal: numberOfCharactersToReveal,
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

    const numberOfCharactersToReveal =
      calculateNumberOfCharactersToReveal(defaultText);

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

  /**
   * Encodes the input text by gradually replacing characters with random ones until fully encoded
   *
   * @param text The input text to encode
   * @returns The encoded text with characters replaced with random ones
   */
  const encodeText = (text: string): string => {
    // If the text is completely randomized, we're done
    if (
      text === randomizeText(defaultText, characterSet) ||
      iterations >= maxIterations
    ) {
      // Check if text is completely encoded (no character matches defaultText)
      const isFullyEncoded = text
        .split("")
        .every((char, index) => char !== defaultText.charAt(index));

      if (isFullyEncoded || iterations >= maxIterations) {
        setIsDone(true);
        // If we've hit max iterations or are fully encoded, return a fully randomized text
        return randomizeText(defaultText, characterSet);
      }
    }

    const numberOfCharactersToEncode =
      calculateNumberOfCharactersToEncode(defaultText);

    // Create a new string to hold our encoded text
    let encodedText = text;

    // Track positions that have already been encoded to avoid re-encoding them
    const encodedPositions = new Set();

    // Keep track of how many characters we've encoded in this iteration
    let encodedCount = 0;

    // Find characters to encode (up to numberOfCharactersToEncode)
    for (let i = 0; i < numberOfCharactersToEncode; i++) {
      // If we've encoded every character or reached our limit, stop
      if (
        encodedCount >= numberOfCharactersToEncode ||
        encodedCount >= defaultText.length
      ) {
        break;
      }

      // Choose a random position to encode
      const position = Math.floor(Math.random() * defaultText.length);

      // Skip if this position is already encoded or the character doesn't match the original
      if (
        encodedPositions.has(position) ||
        encodedText.charAt(position) !== defaultText.charAt(position)
      ) {
        continue;
      }

      // Replace the character at this position with a random character
      const chars = encodedText.split("");
      chars[position] = getRandomCharacter(characterSet);
      encodedText = chars.join("");

      // Mark this position as encoded
      encodedPositions.add(position);
      encodedCount++;
    }

    return encodedText;
  };

  useEffect(() => {
    setIsDone(false);
    setIterations(0);
    setFormattedText(formatDefaultText(defaultText));
  }, [defaultText]);

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
      setIterations((previousIterations) => previousIterations + 1);

      setFormattedText((previousText) => {
        switch (action) {
          case "decode":
            return decodeText(previousText);
          case "encode":
            return encodeText(previousText);
          case "transform":
            return transformText(previousText);
          case "scramble":
            return scrambleText(previousText);
        }
      });
    },

    // Run the interval if the action is one of the supported types and we're not done
    ACTIONS.includes(action)
      ? !isDone && (action !== "transform" || defaultText !== targetText)
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
    <span ref={ref} {...restProps}>
      {isClient
        ? formattedText
        : action === "transform"
          ? targetText
          : defaultText}
    </span>
  );
};

export default Ciph3rText;
