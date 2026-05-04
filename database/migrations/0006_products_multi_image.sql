-- Phase 2: add multi-image support and admin audit column

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.products
SET images = jsonb_build_array(
  jsonb_build_object(
    'url',       image_url,
    'alt',       name,
    'order',     0,
    'blurDataUrl', NULL
  )
)
WHERE jsonb_array_length(images) = 0
  AND image_url IS NOT NULL;

COMMENT ON COLUMN public.products.image_url IS 'DEPRECATED: use images[0].url';

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS updated_by uuid REFERENCES public.users(id);

CREATE INDEX IF NOT EXISTS idx_products_active
  ON public.products(is_active)
  WHERE is_active = true;
