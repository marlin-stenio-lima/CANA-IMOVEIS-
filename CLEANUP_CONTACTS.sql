-- Clean up invalid contacts that are causing 'Number not found' errors

-- 1. Delete contacts that are actually Groups (Remote JID ends in @g.us)
-- Note: Cascade delete on messages is required if you have messages linked to them.
-- If you haven't run SETUP_CASCADE_DELETE.sql yet, this might fail or leave orphan messages.
-- Ideally:
delete from messages where remote_jid like '%@g.us';
delete from contacts where remote_jid like '%@g.us';

-- 2. Delete contacts that are actually LIDs (Remote JID ends in @lid)
-- These are internal device IDs, not messageable phone numbers.
delete from messages where remote_jid like '%@lid';
delete from contacts where remote_jid like '%@lid';

-- 3. Delete contacts with phone numbers that look like LIDs (too long, > 14 digits)
-- Brazil phones are max 13 (55 + 2 + 9 + 8 = 11 + 2 = 13).
-- Let's say > 15 just to be safe.
delete from contacts where length(phone) > 15;
