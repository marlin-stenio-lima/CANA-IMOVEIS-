import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env correctly
const envContent = fs.readFileSync('.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let value = match[2] ? match[2].trim() : '';
        if (value.startsWith('"') && value.endsWith('"')) { value = value.substring(1, value.length - 1); }
        env[match[1]] = value;
    }
});

const supabase = createClient(env['VITE_SUPABASE_URL'], env['VITE_SUPABASE_ANON_KEY'] || env['VITE_SUPABASE_PUBLISHABLE_KEY']);

async function checkColumns() {
    console.log('Checking columns for table: appointments');
    // Try to select 1 row to see what we get
    const { data, error } = await supabase.from('appointments').select('*').limit(1);
    
    if (error) {
        console.error('Error fetching from appointments:', error);
    } else {
        console.log('Successfully fetched sample row:', data[0] || 'Table empty, but schema accessible');
        if (data[0]) {
            console.log('Available columns:', Object.keys(data[0]));
        } else {
            // If empty, we can't see columns via select *, try to insert a dummy row or something? 
            // Better to assume if it failed earlier, it really is missing.
        }
    }
}

checkColumns();
