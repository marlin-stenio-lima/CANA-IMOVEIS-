-- Fix missing phone numbers by extracting from remote_jid
UPDATE contacts 
SET phone = split_part(remote_jid, '@', 1) 
WHERE phone IS NULL OR phone = '';
