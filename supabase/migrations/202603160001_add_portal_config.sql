-- Add portal_config to properties to allow granular control over publishing
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS portal_config JSONB DEFAULT '{"zap": true, "vivareal": true, "imovelweb": true, "luxury_estate": false, "properstar": false, "olx": true}'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN public.properties.portal_config IS 'JSONB object to track which portals this property should be published to.';

-- Add index on portal_config for faster queries (using GIN for JSONB)
CREATE INDEX IF NOT EXISTS idx_properties_portal_config ON public.properties USING GIN (portal_config);
