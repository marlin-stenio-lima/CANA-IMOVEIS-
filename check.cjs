const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if(key && val) acc[key.trim()] = val.trim().replace(/\"/g, '').replace(/\'/g, '');
  return acc;
}, {});
const url = env.VITE_SUPABASE_URL;
const key = env.VITE_SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
fetch(url + '/rest/v1/team_members?select=id,user_id,name', { headers: { apikey: key, Authorization: 'Bearer ' + key } })
  .then(r => r.json())
  .then(data => console.log('Team Members:', data));
