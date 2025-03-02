import {
  BASE_PRINTABLE_CHARACTERS,
  DEFAULT_MAX_ITERATIONS,
  DEFAULT_REVEAL_PROBABILITY,
} from "./constants";

import type { Ciph3rTextRevealCharactersProps } from "./types";

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
