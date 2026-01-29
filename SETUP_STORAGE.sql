-- Create a new private bucket for chat media (we will enable public access via policies)
-- Note: 'public' column in buckets table determines if it's publicly accessible via URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all files in 'chat-media'
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chat-media' );

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'chat-media' );

-- Policy: Allow Service Role (Edge Functions) full access
-- Service role typically bypasses RLS, but explicit policies can be useful if RLS is enforced strictly.
-- Usually not needed for service_role if RLS isn't explicitly restricting it, but good practice if using a distinct role.
-- Since edge functions use service_role key, they bypass RLS by default in Supabase client if configured correctly.
