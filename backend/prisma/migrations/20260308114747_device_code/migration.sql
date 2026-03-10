/*
  Warnings:

  - A unique constraint covering the columns `[device_code]` on the table `CliAuth` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CliAuth_device_code_key" ON "CliAuth"("device_code");
