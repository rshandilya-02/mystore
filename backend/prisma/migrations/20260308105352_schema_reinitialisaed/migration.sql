/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "CliAuth" (
    "id" TEXT NOT NULL,
    "user_code" TEXT NOT NULL,
    "device_code" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CliAuth_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CliAuth" ADD CONSTRAINT "CliAuth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
