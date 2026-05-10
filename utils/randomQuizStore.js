/**
 * In-memory store for the active Random Quiz session.
 * Since random quizzes don't persist to IndexedDB (different questions each time),
 * this module holds the questions, answers, and metadata needed by Results and Review screens.
 */

let store = null;

export function setRandomQuizData({ questions, answers, score, selectedCount, elapsedSeconds }) {
  store = { questions, answers, score, selectedCount, elapsedSeconds };
}

export function getRandomQuizData() {
  return store;
}

export function clearRandomQuizData() {
  store = null;
}
