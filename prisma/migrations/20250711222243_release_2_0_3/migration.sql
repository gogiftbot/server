-- CreateTable
CREATE TABLE "raffles" (
    "id" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "end_date" TIMESTAMP(3) NOT NULL,
    "nft_id" TEXT NOT NULL,
    "account_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raffles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffle_tasks" (
    "id" TEXT NOT NULL,
    "title_ru" VARCHAR(255) NOT NULL,
    "title_en" VARCHAR(255) NOT NULL,
    "link_title" VARCHAR(255),
    "link_url" VARCHAR(255),
    "raffle_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raffle_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raffle_nfts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "raffle_nfts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_raffle_participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_raffle_participants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_raffle_participants_B_index" ON "_raffle_participants"("B");

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_nft_id_fkey" FOREIGN KEY ("nft_id") REFERENCES "raffle_nfts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffles" ADD CONSTRAINT "raffles_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raffle_tasks" ADD CONSTRAINT "raffle_tasks_raffle_id_fkey" FOREIGN KEY ("raffle_id") REFERENCES "raffles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raffle_participants" ADD CONSTRAINT "_raffle_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_raffle_participants" ADD CONSTRAINT "_raffle_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "raffles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
