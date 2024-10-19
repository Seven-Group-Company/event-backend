/*
  Warnings:

  - You are about to drop the `mfa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "mfa" DROP CONSTRAINT "mfa_email_fkey";

-- DropTable
DROP TABLE "mfa";
