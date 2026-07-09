CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "opportunities" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "project_description" TEXT NOT NULL,
  "proposal_summary" TEXT NOT NULL,
  "proposal_sent" DATE NOT NULL,
  "responded" BOOLEAN NOT NULL DEFAULT FALSE,
  "interview" BOOLEAN NOT NULL DEFAULT FALSE,
  "won" BOOLEAN NOT NULL DEFAULT FALSE,
  "status" TEXT NOT NULL DEFAULT 'propuesta',
  "loss_reason" TEXT,
  "source" TEXT NOT NULL DEFAULT 'manual',
  "metadata" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "opportunities_status_check" CHECK ("status" IN ('propuesta', 'respondio', 'entrevista', 'ganada', 'perdida'))
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW."updated_at" = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER opportunities_set_updated_at
BEFORE UPDATE ON "opportunities"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
