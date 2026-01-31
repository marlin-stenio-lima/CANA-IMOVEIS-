-- Add wamid column to messages table to store WhatsApp Message ID
ALTER TABLE messages ADD COLUMN IF NOT EXISTS wamid TEXT;

-- Make it unique to prevent duplicates and enable UPSERT by wamid
ALTER TABLE messages ADD CONSTRAINT messages_wamid_key UNIQUE (wamid);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_messages_wamid ON messages(wamid);
