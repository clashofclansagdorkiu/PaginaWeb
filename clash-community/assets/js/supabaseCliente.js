// Importamos la librería de Supabase desde el CDN (Internet)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- CONFIGURACIÓN ---
const supabaseUrl = 'https://eldydavwmrgdwkppocym.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZHlkYXZ3bXJnZHdrcHBvY3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMDg0ODIsImV4cCI6MjA3OTY4NDQ4Mn0.dGvXYbZdnJnFmF0z9HJvavlZdNLV3PYcOxQQF3msb68'

// Creamos la conexión
export const supabase = createClient(supabaseUrl, supabaseKey)