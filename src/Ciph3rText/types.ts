export type Ciph3rTextAction = "encode" | "decode" | "transform";

export interface Ciph3rTextProps {
  defaultText: string;
  targetText?: string;
  action?: Ciph3rTextAction;
  iterationSpeed?: number;
  maxIterations?: number;
  onFinish?: () => void;
}

export interface Ciph3rTextRevealCharactersProps {
  action?: Ciph3rTextAction;
  sourceText: string;
  targetText: string;
  maxCharactersToReveal: number;
  currentIteration: number;
  maxIterations?: number;
  revealProbability?: number;
}
