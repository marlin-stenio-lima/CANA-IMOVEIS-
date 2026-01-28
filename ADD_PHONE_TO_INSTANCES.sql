-- Add phone column to instances table
ALTER TABLE public.instances 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Notify schema reload
NOTIFY pgrst, 'reload schema';
