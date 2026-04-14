import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg"
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkContact() {
    const contactName = 'Marlon Stenio'
    console.log(`Checking contact: ${contactName}`)

    const { data: contact, error: cErr } = await supabase
        .from('contacts')
        .select('id, company_id, name')
        .ilike('name', `%${contactName}%`)

    if (cErr) {
        console.error('Error:', cErr)
        return
    }

    console.log('Results:', contact)
}

checkContact()
