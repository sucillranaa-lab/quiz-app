# IFIC Chapter 1 Quiz Data — Design

## Purpose
Create a new quiz data file with 15-20 original multiple-choice questions based on Chapter 1 ("The Role of the Mutual Fund Sales Representative") of the IFIC course textbook.

## File
- **New file:** `QuizData/quizdataIFIC_Ch01.js`
- **Export name:** `IFIC_Chapter01` (array of question objects)
- **Format:** Matches existing `quizdataIFIC1.js` — each question has `id`, `question`, `options` (4-item array), `correct` (0-based index), `feedback`

## Topics Covered
| Topic | Questions |
|---|---|
| Evolution & history of mutual funds | 2-3 |
| Value of licensing | 1-2 |
| Client service importance & rewards | 2 |
| Legal, ethical & professional responsibilities | 3-4 |
| KYC (6 components) | 2-3 |
| KYP & Suitability | 2-3 |
| Role of MF rep vs financial planner | 2 |
| CFRs / fiduciary duty / disclosure | 1-2 |

## Integration
Update `QuizData/index.js` to import the new module and add it to the `quizSources` array.

## Constraints
- Questions must be factually accurate based on the extracted PDF text
- All 4 options must be plausible
- Feedback must reference chapter content for learning value
- No duplicate or near-duplicate questions with existing quizdata files
