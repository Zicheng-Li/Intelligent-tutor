-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuizQuestion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_QuizQuestion" ("correctAnswer", "id", "question", "quizId") SELECT "correctAnswer", "id", "question", "quizId" FROM "QuizQuestion";
DROP TABLE "QuizQuestion";
ALTER TABLE "new_QuizQuestion" RENAME TO "QuizQuestion";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
