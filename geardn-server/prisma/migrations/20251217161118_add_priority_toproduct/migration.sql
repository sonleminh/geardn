-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "Product_priority_idx" ON "Product"("priority");
