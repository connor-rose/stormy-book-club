-- Create books table in Supabase
-- Run this in SQL Editor in your Supabase dashboard

CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status TEXT NOT NULL DEFAULT 'reading',
  rating INTEGER DEFAULT 0,
  archived BOOLEAN DEFAULT false,
  date_added TIMESTAMP DEFAULT NOW(),
  date_completed TIMESTAMP,
  icon_type TEXT DEFAULT 'frog',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read and write
-- For public access (you may want to restrict this later)
CREATE POLICY "Allow all operations for everyone" ON books
  FOR ALL USING (true) WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_books_status ON books(status);
CREATE INDEX IF NOT EXISTS idx_books_archived ON books(archived);

