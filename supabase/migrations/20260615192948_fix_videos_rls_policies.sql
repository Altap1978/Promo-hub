/*
# Fix RLS policies for videos table - security hardening

1. Changes
- Keep SELECT public (anyone can view videos)
- Keep INSERT public (anyone can submit videos)
- Remove UPDATE policy (no one can modify videos after submission)
- Remove DELETE policy (no one can delete videos after submission)

2. Security rationale
- Public viewing and submitting is the intended behavior for this video promotion platform
- Preventing modification/deletion protects users' shared content from tampering
- Without authentication, there's no way to verify ownership for edit/delete operations
*/

DROP POLICY IF EXISTS "public_update_videos" ON videos;
DROP POLICY IF EXISTS "public_delete_videos" ON videos;
