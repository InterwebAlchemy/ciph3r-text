import {
  BASE_PRINTABLE_CHARACTERS,
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_REVEAL_PROBABILITY,
  MAXIMUM_CHARACTERS_TO_REMOVE,
  MAXIMUM_CHARACTERS_TO_REVEAL,
  MINIMUM_CHARACTERS_TO_REMOVE,
  MINIMUM_CHARACTERS_TO_REVEAL,
  MINIMUM_CHARACTERS_TO_ADD,
  MAXIMUM_CHARACTERS_TO_ADD,
} from "./constants";

import type {
  Ciph3rTextRevealCharactersProps,
  Ciph3rTextScrambleCharactersProps,
} from "./types";

/**
 * Randomizes the characters in a string
 *
 * @param text - The text to randomize
 * @param characters - The characters to use for the randomization
 * @returns The randomized text
 */
export const randomizeText = (
  text: string,
  characters: string = BASE_PRINTABLE_CHARACTERS,
): string =>
  text
    .split("")
    .map(() => getRandomCharacter(characters))
    .join("");

/**
 * Gets a random character from a string
 *
 * @param characters - The characters to use for the randomization
 * @returns The random character
 */
export const getRandomCharacter = (
  characters: string = BASE_PRINTABLE_CHARACTERS,
): string => characters[Math.floor(Math.random() * characters.length)];

/**
 * Reveals characters from a target text based on probability and iteration limits
 *
 * @param sourceText - The current text being transformed
 * @param targetText - The target text to reveal characters from
 * @param maxCharactersToReveal - Maximum number of characters to reveal in this iteration
 * @param currentIteration - The current iteration count
 * @param maxIterations - The maximum number of iterations
 * @param revealProbability - Probability (0-1) that a character will be revealed (default: 0.5)
 * @returns The transformed text
 */
export const revealCharacters = ({
  action = "decode",
  sourceText,
  targetText,
  maxCharactersToReveal,
  currentIteration,
  maxIterations: maxIterationsProp,
  revealProbability = DEFAULT_REVEAL_PROBABILITY,
}: Ciph3rTextRevealCharactersProps): string => {
  let charactersRevealed = 0;
  let maxRevealed = false;

  const maxIterations = maxIterationsProp ?? DEFAULT_MAX_ITERATIONS[action];

  const transformedText = sourceText
    .split("")
    .map((char, i) => {
      if (sourceText[i] !== targetText[i]) {
        // Reveal character if we've reached max iterations or by probability
        if (
          currentIteration >= maxIterations ||
          (Math.random() > revealProbability && !maxRevealed)
        ) {
          charactersRevealed++;

          if (charactersRevealed >= maxCharactersToReveal) {
            maxRevealed = true;
          }

          return targetText[i];
        }

        return getRandomCharacter();
      }

      return char;
    })
    .join("");

  return transformedText;
};

/**
 * Scrambles the characters in a string
 *
 * @param text - The text to scramble
 * @param maxCharactersToScramble - The maximum number of characters to scramble
 * @returns The scrambled text
 */
export const scrambleCharacters = ({
  text,
  characterSet,
  maxCharactersToScramble,
}: Ciph3rTextScrambleCharactersProps): string => {
  const characters = text.split("");

  for (let i = 0; i < maxCharactersToScramble; i++) {
    // choose a randomish index
    const randomIndex = Math.floor(Math.random() * characters.length);

    const [temp, temp2] = [characters[i], characters[randomIndex]];

    // introduce some random characters, too
    if (Math.random() > DEFAULT_REVEAL_PROBABILITY) {
      characters[i] = getRandomCharacter(characterSet);
      characters[randomIndex] = getRandomCharacter(characterSet);
    } else {
      characters[i] = temp2;
      characters[randomIndex] = temp;
    }
  }

  return characters.join("");
};

/**
 * Calculates the number of characters to encode based on the length of the text
 * number of characters to reveal
 *
 * @remarks
 * If the maximum number of characters to reveal is greater than or equal to the
 * length of the text minus one, the minimum number of characters to reveal will
 * be returned. Otherwise, a random number between the mininum and maximum number
 * of characters to reveal will be returned.
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to reveal
 * @param minCharactersToReveal - The minimum number of characters to reveal
 * @param maxCharactersToReveal - The maximum number of characters to reveal
 * @returns The number of characters to encode
 */
export const calculateNumberOfCharactersToEncode = (
  defaultText: string,
  weight = 1,
  minCharactersToReveal = MINIMUM_CHARACTERS_TO_REVEAL,
  maxCharactersToReveal = MAXIMUM_CHARACTERS_TO_REVEAL,
): number => {
  if (maxCharactersToReveal >= defaultText.length - 1) {
    return minCharactersToReveal;
  }

  return (
    Math.floor(Math.random() * Math.floor(maxCharactersToReveal * weight)) +
    minCharactersToReveal
  );
};

/**
 * Calculates the number of characters to reveal based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to reveal
 * @param minCharactersToReveal - The minimum number of characters to reveal
 * @param maxCharactersToReveal - The maximum number of characters to reveal
 * @returns The number of characters to reveal
 */
export const calculateNumberOfCharactersToReveal = (
  defaultText: string,
  weight = 1,
  minCharactersToReveal = MINIMUM_CHARACTERS_TO_REVEAL,
  maxCharactersToReveal = MAXIMUM_CHARACTERS_TO_REVEAL,
): number => {
  if (maxCharactersToReveal >= defaultText.length - 1) {
    return minCharactersToReveal;
  }

  return (
    Math.floor(Math.random() * Math.floor(maxCharactersToReveal * weight)) +
    minCharactersToReveal
  );
};

/**
 * Calculates the number of characters to remove based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to remove
 * @param minCharactersToRemove - The minimum number of characters to remove
 * @param maxCharactersToRemove - The maximum number of characters to remove
 * @returns The number of characters to remove
 */
export const calculateNumberOfCharactersToRemove = (
  defaultText: string,
  weight = 1,
  minCharactersToRemove = MINIMUM_CHARACTERS_TO_REMOVE,
  maxCharactersToRemove = MAXIMUM_CHARACTERS_TO_REMOVE,
): number => {
  if (maxCharactersToRemove >= defaultText.length - 1) {
    return minCharactersToRemove;
  }

  return (
    Math.floor(Math.random() * Math.floor(maxCharactersToRemove * weight)) +
    minCharactersToRemove
  );
};

/**
 * Calculates the number of characters to add based on the length of the text
 *
 * @param defaultText - The default text
 * @param weight - A weight to bias the number of characters to add
 * @param minCharactersToAdd - The minimum number of characters to add
 * @param maxCharactersToAdd - The maximum number of characters to add
 * @returns The number of characters to add
 */
export const calculateNumberOfCharactersToAdd = (
  defaultText: string,
  weight = 1,
  minCharactersToAdd = MINIMUM_CHARACTERS_TO_ADD,
  maxCharactersToAdd = MAXIMUM_CHARACTERS_TO_ADD,
): number => {
  if (maxCharactersToAdd >= defaultText.length - 1) {
    return minCharactersToAdd;
  }

  return (
    Math.floor(Math.random() * Math.floor(maxCharactersToAdd * weight)) +
    minCharactersToAdd
  );
};

/**
 * Calculates the number of characters to scramble based on the length of the text
 *
 * @param defaultText - The default text
 * @returns The number of characters to scramble
 */
export const calculateNumberOfCharactersToScramble = (
  defaultText: string,
): number =>
  Math.floor(
    Math.random() * Math.floor(defaultText.length * DEFAULT_REVEAL_PROBABILITY),
  );
