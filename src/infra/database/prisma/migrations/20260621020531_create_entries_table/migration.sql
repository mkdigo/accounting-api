-- CreateTable
CREATE TABLE "entries" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "inclusion" TIMESTAMP(3) NOT NULL,
    "debit_id" TEXT NOT NULL,
    "credit_id" TEXT NOT NULL,
    "value" DECIMAL(15,2) NOT NULL,
    "note" TEXT NOT NULL,

    CONSTRAINT "entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_debit_id_fkey" FOREIGN KEY ("debit_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_credit_id_fkey" FOREIGN KEY ("credit_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entries" ADD CONSTRAINT "entries_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
