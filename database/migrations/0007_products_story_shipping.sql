-- Phase 6: add story column to products; seed shipping_zones table

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS story jsonb;

COMMENT ON COLUMN public.products.story IS 'Rich editorial story object: {title, subtitle, desc, details, featureName, featureDesc, theme, color}';

CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_name      text NOT NULL,
  states         text[] NOT NULL DEFAULT '{}',
  cost           numeric(10,2) NOT NULL DEFAULT 0,
  estimated_days text NOT NULL DEFAULT '3-5 days',
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_shipping_zones_active
  ON public.shipping_zones(is_active)
  WHERE is_active = true;

INSERT INTO public.shipping_zones (zone_name, states, cost, estimated_days)
VALUES
  ('North',     ARRAY['Delhi','Punjab','Haryana','Himachal Pradesh','Jammu and Kashmir','Uttarakhand','Uttar Pradesh'], 50,  '2-3 days'),
  ('South',     ARRAY['Karnataka','Tamil Nadu','Telangana','Andhra Pradesh','Kerala'],                                 60,  '3-4 days'),
  ('West',      ARRAY['Maharashtra','Gujarat','Goa','Rajasthan'],                                                      50,  '2-3 days'),
  ('East',      ARRAY['West Bengal','Odisha','Bihar','Jharkhand','Chhattisgarh'],                                      80,  '4-5 days'),
  ('Northeast', ARRAY['Assam','Manipur','Mizoram','Tripura','Meghalaya','Nagaland','Arunachal Pradesh','Sikkim'],     100, '5-7 days'),
  ('Central',   ARRAY['Madhya Pradesh'],                                                                               60,  '3-4 days')
ON CONFLICT DO NOTHING;
