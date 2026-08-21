-- AlterTable
ALTER TABLE "Deal" ADD COLUMN     "closedAt" TIMESTAMP(3);

-- Backfill: negócios já fechados (Ganho/Perdido) recebem closedAt = updatedAt,
-- para não sumirem das métricas que passam a filtrar por closedAt.
UPDATE "Deal" SET "closedAt" = "updatedAt"
WHERE "stage" IN ('GANHO', 'PERDIDO') AND "closedAt" IS NULL;

-- CreateIndex
CREATE INDEX "Deal_closedAt_idx" ON "Deal"("closedAt");
