-- Fix Storage RLS for chat-media bucket to allow uploads from all users (including anon/public)
-- This is necessary if the CRM users are not managed directly via Supabase Auth 'authenticated' role.

-- 1. Ensure bucket is public
UPDATE storage.buckets SET public = true WHERE id = 'chat-media';

-- 2. Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can upload chat media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Chat Media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 3. Create permissive policies for the chat-media bucket
-- Allow INSERT (Upload)
CREATE POLICY "Allow Chat Uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'chat-media' );

-- Allow UPDATE (for upsert support)
CREATE POLICY "Allow Chat Updates"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'chat-media' );

-- Allow SELECT (Read)
CREATE POLICY "Allow Chat Reads"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'chat-media' );

-- Allow DELETE (Optional, for cleanup)
CREATE POLICY "Allow Chat Deletes"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'chat-media' );
