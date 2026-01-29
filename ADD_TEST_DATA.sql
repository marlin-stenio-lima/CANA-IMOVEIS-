-- 1. Ensure we have an Instance
DO $$
DECLARE
    v_instance_id uuid;
BEGIN
    -- Check if 'primary' instance exists, if not create it
    SELECT id INTO v_instance_id FROM public.instances WHERE name = 'primary';
    
    IF v_instance_id IS NULL THEN
        INSERT INTO public.instances (name, status)
        VALUES ('primary', 'open')
        RETURNING id INTO v_instance_id;
    END IF;

    -- 2. Create a Dummy Contact
    INSERT INTO public.contacts (remote_jid, name, phone, profile_pic_url)
    VALUES 
        ('5511999999999@s.whatsapp.net', 'Cliente Teste', '5511999999999', 'https://github.com/shadcn.png')
    ON CONFLICT (remote_jid) DO NOTHING;

    -- 3. Create a Dummy Conversation
    INSERT INTO public.conversations (contact_id, instance_id, last_message, unread_count)
    SELECT 
        c.id, 
        v_instance_id, 
        'Olá! Isso é um teste.', 
        1
    FROM public.contacts c
    WHERE c.remote_jid = '5511999999999@s.whatsapp.net'
    AND NOT EXISTS (
        SELECT 1 FROM public.conversations conv 
        WHERE conv.contact_id = c.id
    );

    -- 4. Create a Dummy Message
    INSERT INTO public.messages (conversation_id, contact_id, instance_id, content, sender_type, direction, status)
    SELECT 
        conv.id, 
        conv.contact_id, 
        v_instance_id, 
        'Olá! Isso é um teste.', 
        'contact', 
        'inbound', 
        'delivered'
    FROM public.conversations conv
    JOIN public.contacts c ON c.id = conv.contact_id
    WHERE c.remote_jid = '5511999999999@s.whatsapp.net'
    AND NOT EXISTS (
        SELECT 1 FROM public.messages m WHERE m.conversation_id = conv.id
    );

END $$;
