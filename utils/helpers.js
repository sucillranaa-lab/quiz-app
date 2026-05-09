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
