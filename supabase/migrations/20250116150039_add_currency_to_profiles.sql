-- Add currency column to profiles table
ALTER TABLE profiles
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';
