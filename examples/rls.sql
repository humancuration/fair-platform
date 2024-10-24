-- Example RLS policy
CREATE POLICY "Users can only edit their own AI projects"
ON ai_projects
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
