/*
# Create videos table (single-tenant, public sharing)

1. New Tables
- `videos`
  - `id` (uuid, primary key)
  - `url` (text, not null) - the video URL
  - `platform` (text, not null) - 'tiktok' or 'youtube'
  - `title` (text, optional) - optional title/description
  - `created_at` (timestamptz, auto-generated)
2. Security
- Enable RLS on `videos`.
- Allow anon + authenticated CRUD because the data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  platform text NOT NULL CHECK (platform IN ('tiktok', 'youtube')),
  title text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_videos" ON videos;
CREATE POLICY "public_select_videos" ON videos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_videos" ON videos;
CREATE POLICY "public_insert_videos" ON videos FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_videos" ON videos;
CREATE POLICY "public_update_videos" ON videos FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_videos" ON videos;
CREATE POLICY "public_delete_videos" ON videos FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS videos_created_at_idx ON videos(created_at DESC);
