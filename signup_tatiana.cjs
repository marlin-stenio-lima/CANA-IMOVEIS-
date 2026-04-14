const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('e:\\Samsung\\Downloads\\ANTIGRAVITY = GITHUB - NÃO EXCLUIR\\crm-suite-pro\\.env', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && rest.length > 0) {
        env[key.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_PUBLISHABLE_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function signupUser() {
    console.log("Tentando registrar a usuária Tatiana...");

    // Deleta o admin anterior se existir para garantir que a API Auth do Supabase cuida de tudo
    // Note: this might fail if we don't have service_role, but that's ok, signUp might still work.

    const { data, error } = await supabase.auth.signUp({
        email: 'tatiana@canaaluxo.com',
        password: 'Alanh310896',
        options: {
            data: {
                full_name: 'Tatiana',
                company_id: 'c2a6a6a6-c2a6-4c2a-8c2a-2c2a6a6a6a6a'
            }
        }
    });

    if (error) {
        console.error("Erro ao registrar:", error);
    } else {
        console.log("Usuária registrada com sucesso!");
        console.log("User ID:", data.user?.id);
    }
}

signupUser();
