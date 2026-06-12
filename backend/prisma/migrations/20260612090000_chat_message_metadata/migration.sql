ALTER TABLE "chat_messages"
ADD COLUMN IF NOT EXISTS "metadata" JSONB DEFAULT '{}'::jsonb;

UPDATE "chat_messages"
SET "metadata" = '{}'::jsonb
WHERE "metadata" IS NULL;
