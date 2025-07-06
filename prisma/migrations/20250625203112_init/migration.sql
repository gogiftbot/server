-- CreateEnum
CREATE TYPE "language" AS ENUM ('RU', 'EN');

-- CreateEnum
CREATE TYPE "transaction_type" AS ENUM ('deposit', 'withdraw');

-- CreateEnum
CREATE TYPE "transaction_status" AS ENUM ('pending', 'completed', 'declined');

-- CreateEnum
CREATE TYPE "transaction_currency" AS ENUM ('ton', 'star');

-- CreateEnum
CREATE TYPE "bonus_type" AS ENUM ('deposit');

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "value" VARCHAR(10) NOT NULL,
    "percent" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "account_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "username" TEXT NOT NULL,
    "language" "language" NOT NULL DEFAULT 'EN',
    "telegram_id" VARCHAR(255),
    "avatar_url" VARCHAR(255),
    "referred_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nfts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_gifts" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "is_sold" BOOLEAN NOT NULL DEFAULT false,
    "is_withdraw" BOOLEAN NOT NULL DEFAULT false,
    "account_id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "case_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_nfts" (
    "account_id" TEXT NOT NULL,
    "nft_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_nfts_pkey" PRIMARY KEY ("account_id","nft_id")
);

-- CreateTable
CREATE TABLE "gift_cases" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "star_price" INTEGER NOT NULL DEFAULT 0,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gift_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_nft_transaction" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "account_nftAccountId" TEXT NOT NULL,
    "account_nftNftId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_nft_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "type" "transaction_type" NOT NULL DEFAULT 'deposit',
    "status" "transaction_status" NOT NULL DEFAULT 'pending',
    "currency" "transaction_currency" NOT NULL DEFAULT 'ton',
    "amount" DOUBLE PRECISION NOT NULL,
    "address" TEXT,
    "accountId" TEXT NOT NULL,
    "account_giftId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ton_transactions" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "lt" TEXT,
    "transaction_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ton_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promo_codes" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "uses" INTEGER NOT NULL,
    "bonus_value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bonuses" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "type" "bonus_type" NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "promo_code_id" TEXT NOT NULL,
    "account_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_gift_caseTonft" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_gift_caseTonft_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_account_id_key" ON "referrals"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_value_key" ON "referrals"("value");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "ton_transactions_transaction_id_key" ON "ton_transactions"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "promo_codes_value_key" ON "promo_codes"("value");

-- CreateIndex
CREATE UNIQUE INDEX "bonuses_transaction_id_key" ON "bonuses"("transaction_id");

-- CreateIndex
CREATE INDEX "_gift_caseTonft_B_index" ON "_gift_caseTonft"("B");

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_referred_by_id_fkey" FOREIGN KEY ("referred_by_id") REFERENCES "referrals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_gifts" ADD CONSTRAINT "account_gifts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_gifts" ADD CONSTRAINT "account_gifts_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_gifts" ADD CONSTRAINT "account_gifts_case_id_fkey" FOREIGN KEY ("case_id") REFERENCES "gift_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_nfts" ADD CONSTRAINT "account_nfts_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_nfts" ADD CONSTRAINT "account_nfts_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_nft_transaction" ADD CONSTRAINT "account_nft_transaction_account_nftAccountId_account_nftNf_fkey" FOREIGN KEY ("account_nftAccountId", "account_nftNftId") REFERENCES "account_nfts"("account_id", "nft_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_giftId_fkey" FOREIGN KEY ("account_giftId") REFERENCES "account_gifts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ton_transactions" ADD CONSTRAINT "ton_transactions_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonuses" ADD CONSTRAINT "bonuses_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "promo_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonuses" ADD CONSTRAINT "bonuses_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bonuses" ADD CONSTRAINT "bonuses_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gift_caseTonft" ADD CONSTRAINT "_gift_caseTonft_A_fkey" FOREIGN KEY ("A") REFERENCES "gift_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gift_caseTonft" ADD CONSTRAINT "_gift_caseTonft_B_fkey" FOREIGN KEY ("B") REFERENCES "nfts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
