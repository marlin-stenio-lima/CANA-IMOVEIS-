-- Create ENUMs for property management
CREATE TYPE public.property_type AS ENUM ('apartamento', 'casa', 'comercial', 'terreno', 'rural', 'cobertura', 'kitnet', 'sala_comercial', 'galpao', 'fazenda');

CREATE TYPE public.transaction_type AS ENUM ('venda', 'aluguel', 'temporada');

CREATE TYPE public.property_status AS ENUM ('disponivel', 'vendido', 'alugado', 'reservado', 'inativo');

CREATE TYPE public.inquiry_status AS ENUM ('novo', 'contatado', 'convertido', 'descartado');

-- Create properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type public.property_type NOT NULL DEFAULT 'apartamento',
  transaction_type public.transaction_type NOT NULL DEFAULT 'venda',
  price NUMERIC NOT NULL DEFAULT 0,
  bedrooms INTEGER DEFAULT 0,
  bathrooms INTEGER DEFAULT 0,
  parking_spots INTEGER DEFAULT 0,
  area_total NUMERIC DEFAULT 0,
  area_built NUMERIC DEFAULT 0,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  features TEXT[] DEFAULT '{}',
  status public.property_status NOT NULL DEFAULT 'disponivel',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create property_images table
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create site_settings table (one per company)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL UNIQUE REFERENCES public.companies(id) ON DELETE CASCADE,
  site_name TEXT,
  slug TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3b82f6',
  secondary_color TEXT DEFAULT '#1e40af',
  whatsapp TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  about_text TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT site_settings_slug_unique UNIQUE (slug)
);

-- Create property_inquiries table (leads from portal)
CREATE TABLE public.property_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT,
  contact_id UUID REFERENCES public.contacts(id),
  deal_id UUID REFERENCES public.deals(id),
  status public.inquiry_status DEFAULT 'novo',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for properties
CREATE POLICY "Users can view properties from own company and subsidiaries" 
ON public.properties FOR SELECT 
USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert properties in own company" 
ON public.properties FOR INSERT 
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update properties in own company" 
ON public.properties FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete properties in own company" 
ON public.properties FOR DELETE 
USING (public.can_modify_company_data(company_id));

-- Public read for published properties (for the public portal)
CREATE POLICY "Anyone can view published properties" 
ON public.properties FOR SELECT 
USING (is_published = true);

-- RLS Policies for property_images
CREATE POLICY "Users can view images from accessible properties" 
ON public.property_images FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_images.property_id 
  AND (p.is_published = true OR public.can_view_company_data(p.company_id))
));

CREATE POLICY "Users can insert images for own company properties" 
ON public.property_images FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_images.property_id 
  AND public.can_modify_company_data(p.company_id)
));

CREATE POLICY "Users can update images for own company properties" 
ON public.property_images FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_images.property_id 
  AND public.can_modify_company_data(p.company_id)
));

CREATE POLICY "Users can delete images for own company properties" 
ON public.property_images FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM public.properties p 
  WHERE p.id = property_images.property_id 
  AND public.can_modify_company_data(p.company_id)
));

-- RLS Policies for site_settings
CREATE POLICY "Users can view site settings from own company and subsidiaries" 
ON public.site_settings FOR SELECT 
USING (public.can_view_company_data(company_id));

CREATE POLICY "Users can insert site settings for own company" 
ON public.site_settings FOR INSERT 
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can update site settings for own company" 
ON public.site_settings FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

-- Public read for published site settings
CREATE POLICY "Anyone can view published site settings by slug" 
ON public.site_settings FOR SELECT 
USING (is_published = true);

-- RLS Policies for property_inquiries
CREATE POLICY "Users can view inquiries from own company and subsidiaries" 
ON public.property_inquiries FOR SELECT 
USING (public.can_view_company_data(company_id));

CREATE POLICY "Anyone can insert inquiries" 
ON public.property_inquiries FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update inquiries in own company" 
ON public.property_inquiries FOR UPDATE 
USING (public.can_modify_company_data(company_id))
WITH CHECK (public.can_modify_company_data(company_id));

CREATE POLICY "Users can delete inquiries in own company" 
ON public.property_inquiries FOR DELETE 
USING (public.can_modify_company_data(company_id));

-- Create indexes for better performance
CREATE INDEX idx_properties_company_id ON public.properties(company_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_is_published ON public.properties(is_published);
CREATE INDEX idx_properties_is_featured ON public.properties(is_featured);
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_inquiries_property_id ON public.property_inquiries(property_id);
CREATE INDEX idx_property_inquiries_company_id ON public.property_inquiries(company_id);
CREATE INDEX idx_site_settings_slug ON public.site_settings(slug);

-- Create trigger for updated_at on properties
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create trigger for updated_at on site_settings
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Storage policies for property-images bucket
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their property images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');