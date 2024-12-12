import { createClient } from '@supabase/supabase-js'

export const supabase = createClient('https://cwzpmcosygdpwfgxgmbd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3enBtY29zeWdkcHdmZ3hnbWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMDQwMTQsImV4cCI6MjA0OTU4MDAxNH0.PKAL6aqqZO72LJ-jF6kXkvNODU-5ocVwB6SZnVq0_q4')