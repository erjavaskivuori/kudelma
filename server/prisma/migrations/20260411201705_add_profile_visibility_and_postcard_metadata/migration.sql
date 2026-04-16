-- CreateEnum
CREATE TYPE "CardVisibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "temperatureCelsius" DOUBLE PRECISION,
ADD COLUMN     "weatherMain" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cardsVisibility" "CardVisibility" NOT NULL DEFAULT 'PRIVATE';
