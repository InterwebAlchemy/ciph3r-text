// TODO: Allow extending or overriding the base characters
export const BASE_PRINTABLE_CHARACTERS = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_abcdefghijklmnopqrstuvwxyz{|}~`;

export const ACTIONS = ["encode", "decode", "transform", "scramble"] as const;

export const DEFAULT_REVEAL_PROBABILITY = 0.5;

export const MINIMUM_CHARACTERS_TO_REVEAL = 1;
export const MAXIMUM_CHARACTERS_TO_REVEAL = 5;

export const MINIMUM_CHARACTERS_TO_REMOVE = 1;
export const MAXIMUM_CHARACTERS_TO_REMOVE = 5;

export const MINIMUM_CHARACTERS_TO_ADD = 1;
export const MAXIMUM_CHARACTERS_TO_ADD = 5;

export const BASE_MAX_ITERATIONS = 36;
export const BASE_SPEED = 120;

export const TRANSFORM_ITERATION_MULTIPLIER = 1.5;
export const TRANSFORM_SPEED_MULTIPLIER = 1.25;

export const SCRAMBLE_SPEED_MODIFIER = 0.5;

export const DEFAULT_MAX_ITERATIONS = {
  encode: BASE_MAX_ITERATIONS,
  decode: BASE_MAX_ITERATIONS,
  transform: BASE_MAX_ITERATIONS * TRANSFORM_ITERATION_MULTIPLIER,
  scramble: Infinity,
};

export const DEFAULT_SPEED = {
  encode: BASE_SPEED,
  decode: BASE_SPEED,
  transform: BASE_SPEED * TRANSFORM_SPEED_MULTIPLIER,
  scramble: BASE_SPEED * SCRAMBLE_SPEED_MODIFIER,
};
