import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import * as fs from 'fs';

// Try to read .env
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const lines = envContent.split('\n');
const envVars = {};
lines.forEach(l => {
  const [k, ...v] = l.split('=');
  if (k && v) {
    envVars[k.trim()] = v.join('=').trim().replace(/"/g, '');
  }
});

const supabase = createClient(envVars['VITE_SUPABASE_URL'], envVars['VITE_SUPABASE_PUBLISHABLE_KEY']);

async function check() {
  const { data: deals, error } = await supabase
    .from('deals')
    .select('*, contacts(business_type), pipeline_stages(name)')
  
  if (error) {
    console.error(error);
    return;
  }
  
  console.log(`Found ${deals?.length} total deals`);
  
  const aluguelDeals = deals.filter(d => d.pipeline_stages?.name?.toLowerCase().includes('perdid'));
  console.log(JSON.stringify(aluguelDeals.map(d => ({
    id: d.id,
    stage: d.stage,
    lost_at: d.lost_at,
    created_at: d.created_at,
    updated_at: d.updated_at,
    contact_biz_type: d.contacts?.business_type,
    pipeline_id: d.pipeline_id,
    stage_name: d.pipeline_stages?.name,
    assigned_to: d.assigned_to
  })), null, 2));
}

check();
