-- CreateEnum
CREATE TYPE "AccountGroup" AS ENUM ('assets', 'liabilities', 'equity', 'income_statement_accounts');

-- CreateEnum
CREATE TYPE "AccountSubgroup" AS ENUM ('current_assets', 'non_current_assets', 'current_liabilities', 'non_current_liabilities', 'revenues', 'costs', 'expenses');

-- CreateEnum
CREATE TYPE "AvailableTags" AS ENUM ('bank', 'accounts_receivable', 'accounts_payable', 'credit_card');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group" "AccountGroup" NOT NULL,
    "subgroup" "AccountSubgroup",

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" "AvailableTags" NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts_tags" (
    "account_id" TEXT NOT NULL,
    "tag_id" INTEGER NOT NULL,

    CONSTRAINT "accounts_tags_pkey" PRIMARY KEY ("account_id","tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_tags" ADD CONSTRAINT "accounts_tags_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts_tags" ADD CONSTRAINT "accounts_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
