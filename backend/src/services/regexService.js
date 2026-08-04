/**
  * Servizio per la gestione e la sintassi e la valutazione delle Regex.
  */

/**
 * Parsifica una stringa di regex che potrebbe includere delimitatori tipo /pattern/flags
 * oppure un semplice pattern testuale.
 */
function parseRegexInput(inputPattern) {
  if (typeof inputPattern !== 'string' || !inputPattern.trim()) {
    throw new Error('Espressione regolare non valida o vuota.');
  }

  const trimmed = inputPattern.trim();
  
  // Esempio: /^[a-z]+$/i
  const match = trimmed.match(/^\/(.+)\/([gimsuy]*)$/);
  if (match) {
    return { pattern: match[1], flags: match[2] };
  }

  // Altrimenti è solo un pattern senza delimitatori
  return { pattern: trimmed, flags: '' };
}

/**
 * Inizializza un oggetto RegExp in sicurezza
 */
function compileRegex(inputPattern) {
  const { pattern, flags } = parseRegexInput(inputPattern);
  try {
    return new RegExp(pattern, flags);
  } catch (err) {
    throw new Error(`Sintassi Regex non valida: ${err.message}`);
  }
}

/**
 * Valuta un tentativo rispetto a un insieme di stringhe di controllo
 * @param {string} proposedRegex - L'espressione regolare proposta dal giocatore
 * @param {Array<{string_value: string, is_positive: number}>} controlStrings - Stringhe segrete
 */
function evaluateAttempt(proposedRegex, controlStrings) {
  const regex = compileRegex(proposedRegex);

  let posPassedCount = 0;
  let totalPosCount = 0;
  let negPassedCount = 0;
  let totalNegCount = 0;

  for (const cs of controlStrings) {
    const isMatch = regex.test(cs.string_value);
    
    if (cs.is_positive === 1) {
      totalPosCount++;
      if (isMatch) {
        posPassedCount++;
      }
    } else {
      totalNegCount++;
      // Una stringa di controllo negativa supera la prova SE LA REGEX NON LA SODDISFA
      if (!isMatch) {
        negPassedCount++;
      }
    }
  }

  const isSolved = (posPassedCount === totalPosCount) && (negPassedCount === totalNegCount);

  return {
    posPassedCount,
    totalPosCount,
    negPassedCount,
    totalNegCount,
    isSolved
  };
}

module.exports = {
  parseRegexInput,
  compileRegex,
  evaluateAttempt
};
