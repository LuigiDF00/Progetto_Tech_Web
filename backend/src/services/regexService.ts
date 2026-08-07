export interface ControlStringInput {
  string_value: string;
  is_positive: number;
}

export interface EvaluationResult {
  isSolved: boolean;
  posPassedCount: number;
  totalPosCount: number;
  negPassedCount: number;
  totalNegCount: number;
}

/**
 * Valida e compila una stringa Regex fornita dall'utente.
 */
export function compileRegex(regexPattern: string): RegExp {
  if (!regexPattern || typeof regexPattern !== 'string') {
    throw new Error('Espressione regolare mancante o non valida.');
  }

  // Previeni attacchi ReDoS su pattern pericolosi o eccessivamente complessi
  if (regexPattern.length > 200) {
    throw new Error('L\'espressione regolare supera la lunghezza massima consentita di 200 caratteri.');
  }

  try {
    return new RegExp(regexPattern);
  } catch (err: any) {
    throw new Error(`Sintassi Regex non valida: ${err.message}`);
  }
}

/**
 * Valuta un tentativo rispetto a un insieme di stringhe di controllo
 */
export function evaluateAttempt(proposedRegexPattern: string, controlStrings: ControlStringInput[]): EvaluationResult {
  const compiledRegex = compileRegex(proposedRegexPattern);

  const posStrings = controlStrings.filter(cs => cs.is_positive === 1);
  const negStrings = controlStrings.filter(cs => cs.is_positive === 0);

  let posPassedCount = 0;
  for (const cs of posStrings) {
    if (compiledRegex.test(cs.string_value)) {
      posPassedCount++;
    }
  }

  let negPassedCount = 0;
  for (const cs of negStrings) {
    if (!compiledRegex.test(cs.string_value)) {
      negPassedCount++;
    }
  }

  const isSolved = (posPassedCount === posStrings.length) && (negPassedCount === negStrings.length);

  return {
    isSolved,
    posPassedCount,
    totalPosCount: posStrings.length,
    negPassedCount,
    totalNegCount: negStrings.length
  };
}

export default {
  compileRegex,
  evaluateAttempt
};
