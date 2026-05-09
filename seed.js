import { initDB, addQuiz, addQuestions } from './db/database';

const sampleQuiz = {
  title: 'Banking Knowledge Test',
  questions: [
    {
      questionText: 'What is the primary function of a commercial bank?',
      options: ['Issuing currency', 'Providing credit facilities', 'Regulating money supply', 'Setting interest rates'],
      correctIndex: 1,
      feedback: 'Commercial banks primarily provide credit facilities to individuals and businesses.'
    },
    {
      questionText: 'What is a fixed deposit?',
      options: ['A savings account with unlimited withdrawals', 'A deposit with a fixed maturity period and interest rate', 'A checking account', 'A credit card'],
      correctIndex: 1,
      feedback: 'A fixed deposit is a deposit that has a fixed maturity period and typically offers higher interest rates.'
    },
    {
      questionText: 'What does ATM stand for?',
      options: ['Automated Teller Machine', 'Automatic Transfer Mechanism', 'Account Transaction Module', 'Automated Transaction Manager'],
      correctIndex: 0,
      feedback: 'ATM stands for Automated Teller Machine, which allows customers to perform basic transactions without help.'
    },
    {
      questionText: 'What is KYC in banking?',
      options: ['Keep Your Cash', 'Know Your Customer', 'Key Yearly Credit', 'Knowledge Yield Certificate'],
      correctIndex: 1,
      feedback: 'KYC stands for Know Your Customer, a process of verifying the identity of clients.'
    },
    {
      questionText: 'What is a credit card?',
      options: ['A card for withdrawing cash only', 'A card that allows borrowing money up to a limit', 'A debit card', 'A gift card'],
      correctIndex: 1,
      feedback: 'A credit card allows you to borrow money up to a certain limit to make purchases.'
    },
    {
      questionText: 'What is the central bank of Bangladesh?',
      options: ['World Bank', 'Bangladesh Bank', 'IFIC Bank', 'Central Bank of India'],
      correctIndex: 1,
      feedback: 'Bangladesh Bank is the central bank of Bangladesh.'
    },
    {
      questionText: 'What is mobile banking?',
      options: ['Banking through mobile phones', 'Banking at a bank branch', 'Banking through ATM', 'Banking through computer'],
      correctIndex: 0,
      feedback: 'Mobile banking refers to banking services accessed through mobile devices.'
    },
    {
      questionText: 'What is a loan?',
      options: ['Money saved in bank', 'Money borrowed to be repaid with interest', 'A type of credit card', 'A bank account'],
      correctIndex: 1,
      feedback: 'A loan is money borrowed from a lender that must be repaid with interest.'
    },
    {
      questionText: 'What is interest rate?',
      options: ['Fee charged for banking services', 'Percentage charged for borrowing money', 'Tax on savings', 'Commission on transactions'],
      correctIndex: 1,
      feedback: 'Interest rate is the percentage charged for borrowing money or paid on savings.'
    },
    {
      questionText: 'What is a debit card?',
      options: ['A card that draws from savings account', 'A card that allows overdraft', 'A card for credit purchases', 'A card for international transactions only'],
      correctIndex: 0,
      feedback: 'A debit card draws money directly from your bank account to make purchases.'
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('Initializing database...');
    await initDB();

    console.log('Adding sample quiz...');
    const quizId = await addQuiz(sampleQuiz.title);

    const questionsWithQuizId = sampleQuiz.questions.map(q => ({
      quizId,
      questionText: q.questionText,
      options: q.options,
      correctIndex: q.correctIndex,
      feedback: q.feedback
    }));

    await addQuestions(questionsWithQuizId);

    console.log('Sample quiz added successfully!');
    console.log(`Quiz ID: ${quizId}`);
    console.log(`Questions: ${questionsWithQuizId.length}`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();