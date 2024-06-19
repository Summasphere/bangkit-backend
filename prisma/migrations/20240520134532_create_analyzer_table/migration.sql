/*
  Warnings:

  - A unique constraint covering the columns `[analyzerId]` on the table `history` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "history" ADD COLUMN     "analyzerId" INTEGER;

-- CreateTable
CREATE TABLE "analyzer" (
    "id" SERIAL NOT NULL,
    "urlInput" VARCHAR,
    "fileInput" VARCHAR,
    "dataWordFrequency" TEXT NOT NULL,
    "dataLDA" TEXT NOT NULL,
    "dataPDF" TEXT NOT NULL,

    CONSTRAINT "analyzer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "history_analyzerId_key" ON "history"("analyzerId");

-- AddForeignKey
ALTER TABLE "history" ADD CONSTRAINT "history_analyzerId_fkey" FOREIGN KEY ("analyzerId") REFERENCES "analyzer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
