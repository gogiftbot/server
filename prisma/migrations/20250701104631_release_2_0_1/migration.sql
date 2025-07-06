-- AlterEnum
ALTER TYPE "bonus_type" ADD VALUE 'case';

-- AlterTable
ALTER TABLE "bonuses" ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "promo_codes" ADD COLUMN     "is_free_case" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "bonus_value" DROP NOT NULL;
