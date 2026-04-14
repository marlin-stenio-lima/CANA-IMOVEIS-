import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://uscfxlmtqzqifizunyoz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0NzcwODUsImV4cCI6MjA5MDA1MzA4NX0.RZGdOqupvDkTADAY6YDHxShgvk4ezt3k3zu2nc2wMwg"
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkCompanies() {
    console.log('Checking Companies Table...')
    const { data: companies, error } = await supabase
        .from('companies')
        .select('*')

    if (error) {
        console.error('Error:', error)
        return
    }

    console.log('Companies count:', companies.length)
    companies.forEach(c => {
        console.log(`- ID: ${c.id}, Name: ${c.name}, AI Enabled: ${c.ai_enabled}, Has Key: ${!!c.openai_api_key}`)
        if (c.openai_api_key) {
            console.log(`  Key Start: ${c.openai_api_key.substring(0, 5)}...`)
        }
    })

    console.log('\nChecking Profiles Table (to see company association)...')
    const { data: profiles } = await supabase.from('profiles').select('id, full_name, company_id')
    profiles?.forEach(p => {
        console.log(`- User: ${p.full_name}, CompanyID: ${p.company_id}`)
    })
}

checkCompanies()
