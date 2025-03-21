
-- Add related_id and related_type columns to the attachments table for associating attachments with different entities
ALTER TABLE public.attachments 
ADD COLUMN IF NOT EXISTS related_id UUID,
ADD COLUMN IF NOT EXISTS related_type TEXT;

-- Create an index for faster lookups on related entities
CREATE INDEX IF NOT EXISTS idx_attachments_related_entity
ON public.attachments(related_id, related_type);

-- Update RLS policies to allow access to attachments based on related entities
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow access for authenticated users
CREATE POLICY "Allow authenticated users to access attachments"
ON public.attachments
FOR ALL
TO authenticated
USING (true);
