/*
  Warnings:

  - You are about to drop the column `url` on the `URLRedirect` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_URLRedirect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "sourcePage" TEXT NOT NULL,
    "targetPage" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_URLRedirect" ("campaign", "content", "createdAt", "discount", "id", "medium", "shop", "source", "sourcePage", "targetPage", "term", "title") SELECT "campaign", "content", "createdAt", "discount", "id", "medium", "shop", "source", "sourcePage", "targetPage", "term", "title" FROM "URLRedirect";
DROP TABLE "URLRedirect";
ALTER TABLE "new_URLRedirect" RENAME TO "URLRedirect";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
