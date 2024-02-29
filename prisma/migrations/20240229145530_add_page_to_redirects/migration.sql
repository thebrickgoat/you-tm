/*
  Warnings:

  - Added the required column `page` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_URLRedirect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_URLRedirect" ("campaign", "content", "createdAt", "discount", "id", "medium", "shop", "source", "term", "title", "url") SELECT "campaign", "content", "createdAt", "discount", "id", "medium", "shop", "source", "term", "title", "url" FROM "URLRedirect";
DROP TABLE "URLRedirect";
ALTER TABLE "new_URLRedirect" RENAME TO "URLRedirect";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
