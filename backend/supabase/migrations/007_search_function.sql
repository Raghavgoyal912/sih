-- RPC function used by POST /api/search.
-- Does the cosine-similarity search inside Postgres (via pgvector's <=>
-- operator) instead of pulling every document into Node and comparing
-- in JS — much faster and scales properly once you have real data.
--
-- Run this AFTER 006_fix_embedding_dim.sql.

CREATE OR REPLACE FUNCTION match_documents (
  query_embedding VECTOR(768),
  match_count INT DEFAULT 5,
  filter_org_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    documents.id,
    documents.title,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) AS similarity
  FROM documents
  WHERE
    documents.embedding IS NOT NULL
    AND (filter_org_id IS NULL OR documents.org_id = filter_org_id)
  ORDER BY documents.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Let both anon (public search demo) and authenticated users call this
GRANT EXECUTE ON FUNCTION match_documents TO anon, authenticated;
