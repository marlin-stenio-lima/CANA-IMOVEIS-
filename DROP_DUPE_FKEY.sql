ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_profiles_fkey;
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_assigned_to_profiles_fkey;
NOTIFY pgrst, 'reload schema';
