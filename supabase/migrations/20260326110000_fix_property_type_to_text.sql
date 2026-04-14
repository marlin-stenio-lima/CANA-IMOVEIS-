-- Converte property_type de ENUM para TEXT para suportar todos os tipos do Jetimob

ALTER TABLE public.properties
    ALTER COLUMN property_type TYPE TEXT;
