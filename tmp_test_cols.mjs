import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data: appts } = await supabase.from('appointments').select('*').limit(1);
    console.log('Appts:', appts && appts.length > 0 ? Object.keys(appts[0]) : 'Empty');

    const { data: tasks } = await supabase.from('tasks').select('*').limit(1);
    console.log('Tasks:', tasks && tasks.length > 0 ? Object.keys(tasks[0]) : 'Empty');
}

checkColumns();
