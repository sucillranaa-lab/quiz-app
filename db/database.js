import { openDB } from 'idb';

const DB_NAME = 'quizAppDB';
const DB_VERSION = 1;

export const initDB = async () => {
  const db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Quizzes store
      if (!db.objectStoreNames.contains('quizzes')) {
        const quizStore = db.createObjectStore('quizzes', {
          keyPath: 'id',
          autoIncrement: true
        });
        quizStore.createIndex('title', 'title');
        quizStore.createIndex('createdAt', 'createdAt');
      }

      // Questions store
      if (!db.objectStoreNames.contains('questions')) {
        const questionStore = db.createObjectStore('questions', {
          keyPath: 'id',
          autoIncrement: true
        });
        questionStore.createIndex('quizId', 'quizId');
      }

      // Progress store
      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', {
          keyPath: 'id',
          autoIncrement: true
        });
        progressStore.createIndex('quizId', 'quizId');
      }
    }
  });

  return db;
};

// Quiz operations
export const getAllQuizzes = async () => {
  const db = await initDB();
  return db.getAll('quizzes');
};

export const getQuiz = async (id) => {
  const db = await initDB();
  return db.get('quizzes', id);
};

export const addQuiz = async (title) => {
  const db = await initDB();
  const id = await db.add('quizzes', {
    title,
    createdAt: new Date().toISOString()
  });
  return id;
};

export const deleteQuiz = async (id) => {
  const db = await initDB();
  // Delete all questions for this quiz
  const questions = await db.getAllFromIndex('questions', 'quizId', id);
  for (const q of questions) {
    await db.delete('questions', q.id);
  }
  // Delete all progress for this quiz
  const progressItems = await db.getAllFromIndex('progress', 'quizId', id);
  for (const p of progressItems) {
    await db.delete('progress', p.id);
  }
  // Delete the quiz
  await db.delete('quizzes', id);
};

// Question operations
export const getQuestionsByQuizId = async (quizId) => {
  const db = await initDB();
  return db.getAllFromIndex('questions', 'quizId', quizId);
};

export const getAllQuestions = async () => {
  const db = await initDB();
  return db.getAll('questions');
};

export const addQuestion = async (quizId, questionText, options, correctIndex, feedback) => {
  const db = await initDB();
  const id = await db.add('questions', {
    quizId,
    questionText,
    options,
    correctIndex,
    feedback
  });
  return id;
};

export const addQuestions = async (questions) => {
  const db = await initDB();
  const tx = db.transaction('questions', 'readwrite');
  const ids = [];
  for (const q of questions) {
    const id = await tx.store.add(q);
    ids.push(id);
  }
  await tx.done;
  return ids;
};

// Progress operations
export const getProgressByQuizId = async (quizId) => {
  const db = await initDB();
  const items = await db.getAllFromIndex('progress', 'quizId', quizId);
  // Return the most recent incomplete progress or null if none
  const incomplete = items.find(p => !p.completedAt);
  return incomplete || null;
};

export const getLatestProgressByQuizId = async (quizId) => {
  const db = await initDB();
  const items = await db.getAllFromIndex('progress', 'quizId', quizId);
  if (items.length === 0) {
    return null;
  }

  return items.sort((a, b) => {
    const aDate = a.completedAt || a.updatedAt || a.createdAt || '';
    const bDate = b.completedAt || b.updatedAt || b.createdAt || '';
    return bDate.localeCompare(aDate);
  })[0];
};

export const saveProgress = async (quizId, currentIndex, answers, selectedCount) => {
  const db = await initDB();
  // Check for existing progress
  const existing = await getProgressByQuizId(quizId);

  if (existing) {
    await db.put('progress', {
      ...existing,
      currentIndex,
      answers,
      selectedCount: selectedCount || existing.selectedCount,
      updatedAt: new Date().toISOString()
    });
    return existing.id;
  } else {
    const id = await db.add('progress', {
      quizId,
      currentIndex,
      answers,
      selectedCount,
      completedAt: null,
      score: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return id;
  }
};

export const completeQuiz = async (quizId, score, selectedCount, elapsedSeconds) => {
  const db = await initDB();
  const existing = await getProgressByQuizId(quizId);

  if (existing) {
    await db.put('progress', {
      ...existing,
      selectedCount: selectedCount || existing.selectedCount,
      completedAt: new Date().toISOString(),
      score,
      elapsedSeconds,
      updatedAt: new Date().toISOString()
    });
    return existing.id;
  }

  return db.add('progress', {
    quizId,
    currentIndex: 0,
    answers: {},
    selectedCount,
    completedAt: new Date().toISOString(),
    score,
    elapsedSeconds,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
};

export const clearProgress = async (quizId) => {
  const db = await initDB();
  const items = await db.getAllFromIndex('progress', 'quizId', quizId);
  for (const p of items) {
    await db.delete('progress', p.id);
  }
};

export const clearAllData = async () => {
  const db = await initDB();
  const tx = db.transaction(['quizzes', 'questions', 'progress'], 'readwrite');
  await Promise.all([
    tx.objectStore('quizzes').clear(),
    tx.objectStore('questions').clear(),
    tx.objectStore('progress').clear()
  ]);
  await tx.done;
};
