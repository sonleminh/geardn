-- DropIndex
DROP INDEX "Product_priority_idx";

-- CreateIndex
CREATE INDEX "Product_priority_createdAt_idx" ON "Product"("priority", "createdAt");
