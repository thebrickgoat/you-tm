/*
  Warnings:

  - Added the required column `campaign` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medium` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.
  - Added the required column `term` to the `URLRedirect` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_URLRedirect" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "discount" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "medium" TEXT NOT NULL,
    "campaign" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_URLRedirect" ("createdAt", "id", "shop", "title", "url") SELECT "createdAt", "id", "shop", "title", "url" FROM "URLRedirect";
DROP TABLE "URLRedirect";
ALTER TABLE "new_URLRedirect" RENAME TO "URLRedirect";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
