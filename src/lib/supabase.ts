import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://dotwelbfddgvwwaekgdp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdHdlbGJmZGRndnd3YWVrZ2RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MTQyNDAsImV4cCI6MjA1MjQ5MDI0MH0.pi_UO7k8434_AMEYBz1ui_JUVvckfmi2sniQ6sPlZlA'
)
