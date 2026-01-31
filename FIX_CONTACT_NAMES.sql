-- Fix contacts that were incorrectly named "Você" or using the Agent's name due to the 'fromMe' bug.
-- This script sets their name to the phone number (or NULL) so they can be updated with the correct name later (or manually edited).

-- 1. Identify contacts that are NOT the system owner but have the owner's name/photo.
-- Replace 'Marlon stenio' and 'Você' with the exact names appearing incorrectly in your list.
-- Also replace the profile picture URL if it's your own picture being duplicated.

UPDATE contacts
SET 
  name = phone, -- Reset name to phone number so you know who it is
  profile_pic_url = NULL -- Remove the wrong profile pic
WHERE 
  (name ILIKE '%Marlon stenio%' OR name ILIKE 'Você')
  AND phone NOT LIKE '558695485600%'; -- KEEP your own contact (the real one) safe. Replace with your actual number if different.

-- If you have a lot of corrupted names, you can also just delete them (if you don't mind losing the conversation association until a new message arrives).
-- But updating is safer to keep message history linked.
