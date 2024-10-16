-- CreateTable
CREATE TABLE "otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mfa" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "mfaSecret" TEXT NOT NULL,
    "mfaQrCode" TEXT NOT NULL,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "mfa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_email_key" ON "otp"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mfa_email_key" ON "mfa"("email");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mfa" ADD CONSTRAINT "mfa_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
