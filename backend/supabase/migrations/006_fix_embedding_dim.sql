-- Your documents.embedding column was created as vector(1536), sized for
-- OpenAI embeddings. Since this backend uses Gemini's text-embedding-004
-- model (768 dimensions), the column needs to match, or every insert/search
-- will fail with a dimension mismatch error.
--
-- Safe to run even if the documents table is still empty (recommended to
-- run this BEFORE inserting any real document rows).

ALTER TABLE documents
  ALTER COLUMN embedding TYPE VECTOR(768);
