-- Allow authenticated users to upload files to chat-media bucket
create policy "Authenticated users can upload chat media"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'chat-media' );

-- Allow authenticated users to update their own files (optional, good for metadata)
create policy "Authenticated users can update their uploads"
on storage.objects for update
to authenticated
using ( bucket_id = 'chat-media' and auth.uid() = owner );

-- Allow public access to read is already handled by bucket public status, but explicit policy is safer
create policy "Public Access to Chat Media"
on storage.objects for select
to public
using ( bucket_id = 'chat-media' );
