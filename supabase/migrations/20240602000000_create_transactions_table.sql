-- Drop existing table if exists
DROP TABLE IF EXISTS transactions;

-- Create transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC NOT NULL,
  description TEXT NOT NULL,
  label TEXT NOT NULL CHECK (label IN ('viajes', 'transporte', 'hogar', 'personal', 'servicios')),
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to access their own transactions
CREATE POLICY "Users can manage their own transactions" 
ON transactions 
FOR ALL 
USING (auth.uid() = user_id);
