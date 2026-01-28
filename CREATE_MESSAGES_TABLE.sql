-- Create Contacts table (to store people who message us)
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    remote_jid text not null unique, -- The WhatsApp ID (e.g. 551199999999@s.whatsapp.net)
    name text,
    profile_pic_url text,
    phone text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Messages table
create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    instance_id uuid references public.instances(id) on delete set null,
    contact_id uuid references public.contacts(id) on delete set null,
    remote_jid text not null, -- Redundant but useful for quick queries
    content text,
    media_url text, -- For images/audio
    message_type text default 'text', -- text, image, audio, video, document
    direction text not null check (direction in ('inbound', 'outbound')),
    status text default 'sent', -- sent, delivered, read
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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
