-- Converte colunas de ENUM para TEXT na tabela properties

ALTER TABLE public.properties
    ALTER COLUMN status TYPE TEXT,
    ALTER COLUMN listing_type TYPE TEXT;
