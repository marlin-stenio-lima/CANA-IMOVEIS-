-- Create Contacts table if not exists (base structure)
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure columns exist (Idempotent updates)
do $$ 
begin
    -- Contacts Columns
    if not exists (select 1 from information_schema.columns where table_name = 'contacts' and column_name = 'remote_jid') then
        alter table public.contacts add column remote_jid text;
        alter table public.contacts add constraint contacts_remote_jid_key unique (remote_jid);
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'contacts' and column_name = 'name') then
        alter table public.contacts add column name text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'contacts' and column_name = 'profile_pic_url') then
        alter table public.contacts add column profile_pic_url text;
    end if;

     if not exists (select 1 from information_schema.columns where table_name = 'contacts' and column_name = 'phone') then
        alter table public.contacts add column phone text;
    end if;
end $$;


-- Create Messages table if not exists
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

do $$ 
begin
    -- Messages Columns
    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'instance_id') then
        alter table public.messages add column instance_id uuid references public.instances(id) on delete set null;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'contact_id') then
        alter table public.messages add column contact_id uuid references public.contacts(id) on delete set null;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'remote_jid') then
        alter table public.messages add column remote_jid text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'content') then
        alter table public.messages add column content text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'media_url') then
        alter table public.messages add column media_url text;
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'message_type') then
        alter table public.messages add column message_type text default 'text';
    end if;

    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'direction') then
        alter table public.messages add column direction text; -- check constraint added separately if needed
    end if;
    
    if not exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'status') then
        alter table public.messages add column status text default 'sent';
    end if;
end $$;

-- Enable RLS
alter table public.contacts enable row level security;
alter table public.messages enable row level security;

-- Policies (Simple for now: Authenticated users can see everything)
-- In the future, we can restrict by instance assignment
create policy "Enable read access for authenticated users" on public.contacts
    for select to authenticated using (true);

create policy "Enable insert access for authenticated users" on public.contacts
    for insert to authenticated with check (true);

create policy "Enable read access for authenticated users" on public.messages
    for select to authenticated using (true);

create policy "Enable insert access for authenticated users" on public.messages
    for insert to authenticated with check (true);

-- Realtime
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.contacts;
