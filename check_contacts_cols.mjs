import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkColumns() {
    const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .limit(1)

    if (error) {
        console.error(error)
        return
    }

    if (data && data.length > 0) {
        console.log('Columns found in contacts:', Object.keys(data[0]))
    } else {
        console.log('No data found in contacts to check columns.')
    }
}

checkColumns()
