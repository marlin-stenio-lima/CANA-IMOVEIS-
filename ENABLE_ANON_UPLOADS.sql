CREATE POLICY "Allow public insert to property-images for requests"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'property-images' );
