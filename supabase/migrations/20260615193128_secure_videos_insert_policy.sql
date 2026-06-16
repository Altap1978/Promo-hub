/*
# Update RLS policies for videos table - require auth for INSERT

1. Changes
- SELECT remains public (anyone can view videos)
- INSERT now requires authentication (only logged-in users can submit)
- UPDATE and DELETE remain disabled

2. Security rationale
- Prevents spam and abuse of the video submission feature
- Only authenticated users can promote their content
- Viewing remains open to all visitors
*/

DROP POLICY IF EXISTS "public_insert_videos" ON videos;

CREATE POLICY "authenticated_insert_videos" ON videos FOR INSERT
  TO authenticated WITH CHECK (true);
