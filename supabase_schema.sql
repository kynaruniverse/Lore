-- Create the 'lores' table
CREATE TABLE lores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cover_image_url TEXT,
  hero_image_url TEXT,
  color TEXT,
  page_count INTEGER DEFAULT 0 NOT NULL,
  contributor_count INTEGER DEFAULT 0 NOT NULL,
  is_public BOOLEAN DEFAULT TRUE NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  trending BOOLEAN DEFAULT FALSE NOT NULL,
  created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the 'pages' table
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lore_id UUID NOT NULL REFERENCES lores(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  completeness INTEGER DEFAULT 0 NOT NULL,
  missing_fields TEXT[] DEFAULT ARRAY[]::TEXT[] NOT NULL,
  views INTEGER DEFAULT 0 NOT NULL,
  created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (lore_id, slug)
);

-- Create the 'relationships' table
CREATE TABLE relationships (
  source_page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  target_page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT,
  PRIMARY KEY (source_page_id, target_page_id, type)
);

-- Enable Row Level Security (RLS) for tables
ALTER TABLE lores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for 'lores' table
CREATE POLICY "Public lores are viewable by everyone." ON lores
  FOR SELECT USING (is_public = TRUE);
CREATE POLICY "Owners can create lores." ON lores
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update their lores." ON lores
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Owners can delete their lores." ON lores
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for 'pages' table
CREATE POLICY "Public pages are viewable by everyone." ON pages
  FOR SELECT USING (EXISTS (SELECT 1 FROM lores WHERE lores.id = pages.lore_id AND lores.is_public = TRUE));
CREATE POLICY "Owners can create pages." ON pages
  FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners can update their pages." ON pages
  FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Owners can delete their pages." ON pages
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for 'relationships' table
CREATE POLICY "Relationships are viewable by everyone." ON relationships
  FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can create relationships." ON relationships
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can update their relationships." ON relationships
  FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Owners can delete their relationships." ON relationships
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Triggers for 'lores' table (page_count and contributor_count)
CREATE OR REPLACE FUNCTION update_lore_counts() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'DELETE' THEN
    UPDATE lores
    SET
      page_count = (SELECT COUNT(*) FROM pages WHERE lore_id = NEW.lore_id),
      contributor_count = (SELECT COUNT(DISTINCT created_by) FROM pages WHERE lore_id = NEW.lore_id)
    WHERE id = NEW.lore_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lore_counts_on_page_insert
AFTER INSERT ON pages
FOR EACH ROW EXECUTE FUNCTION update_lore_counts();

CREATE TRIGGER update_lore_counts_on_page_delete
AFTER DELETE ON pages
FOR EACH ROW EXECUTE FUNCTION update_lore_counts();

-- Trigger for 'pages' table (views)
CREATE OR REPLACE FUNCTION increment_page_views() RETURNS TRIGGER AS $$
BEGIN
  UPDATE pages
  SET views = views + 1
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This trigger should be called on a specific event, e.g., when a page is viewed.
-- For a web application, this is typically handled in the application logic
-- rather than a database trigger on UPDATE, as it would fire on any update.
-- If you want to track views directly in the DB, you'd need a separate function call from your app.
-- For now, we'll omit an automatic trigger for views to avoid over-complication.

-- Add updated_at timestamps
CREATE EXTENSION IF NOT EXISTS moddatetime;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON lores
  FOR EACH ROW EXECUTE FUNCTION moddatetime("updated_at");

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION moddatetime("updated_at");
