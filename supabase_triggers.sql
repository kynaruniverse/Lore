-- Trigger to update page_count in 'lores' table after insert/delete on 'pages'
CREATE OR REPLACE FUNCTION update_lore_page_count() RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE lores SET page_count = page_count + 1 WHERE id = NEW.lore_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE lores SET page_count = page_count - 1 WHERE id = OLD.lore_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER pages_page_count_trigger
AFTER INSERT OR DELETE ON pages
FOR EACH ROW EXECUTE FUNCTION update_lore_page_count();

-- Note: contributor_count is more complex and typically handled by RLS policies or a separate function
-- that aggregates distinct user IDs from page edits/creations. For simplicity, this trigger focuses
-- on page_count. A full contributor count would require a more sophisticated approach, potentially
-- involving a separate table for page contributions or a scheduled job to aggregate data.
