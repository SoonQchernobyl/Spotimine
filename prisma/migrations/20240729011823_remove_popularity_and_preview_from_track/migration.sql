/*
  Warnings:

  - You are about to drop the column `popularity` on the `Track` table. All the data in the column will be lost.
  - You are about to drop the column `previewUrl` on the `Track` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "popularity",
DROP COLUMN "previewUrl";
