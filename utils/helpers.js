export const getOptionLetter = (index) => {
  return String.fromCharCode(65 + index); // A, B, C, D, etc.
};

export const calculateScore = (questions, answers) => {
  let score = 0;
  for (const q of questions) {
    const userAnswer = answers[q.id];
    if (userAnswer !== undefined && userAnswer === q.correctIndex) {
      score++;
    }
  }
  return score;
};

export const getAnsweredCount = (answers) => {
  return Object.keys(answers).length;
};

export const getQuizProgressPercent = (questionCount, progress) => {
  if (!questionCount || !progress) {
    return 0;
  }

  const totalCount = progress.selectedCount || questionCount;
  const answeredCount = getAnsweredCount(progress.answers || {});
  return Math.min(100, Math.round((answeredCount / totalCount) * 100));
};

export const isQuizComplete = (questions, answers) => {
  return Object.keys(answers).length === questions.length;
};

export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Parses an HTML table from a text string and returns structured data.
 * Returns null if no <table> tag is found.
 *
 * @param {string} text - Text that may contain an HTML table
 * @returns {{ before: string, after: string, rows: string[][] } | null}
 */
export function parseHtmlTable(text) {
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/i;
  const match = text.match(tableRegex);

  if (!match) return null;

  const tableHtml = match[1];
  const before = text.slice(0, match.index).trim();
  const after = text.slice(match.index + match[0].length).trim();

  const rows = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
    const cells = [];
    const cellRegex = /<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      // Strip any internal HTML tags (e.g. <strong>, <span>) and trim
      const cleanContent = cellMatch[1].replace(/<[^>]+>/g, '').trim();
      cells.push(cleanContent);
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }

  return { before, after, rows };
}
