const COMPANY_ID = '00000000-0000-0000-0000-000000000000'; // Default Tenant
const WEBHOOK_URL = `http://localhost:54321/functions/v1/portal-webhook?company_id=${COMPANY_ID}`;

const sampleLead = {
  portal: 'ZAP',
  client_name: 'Teste De Lead Antigravity',
  client_email: 'teste@exemplo.com',
  client_phone: '11999999999',
  message: 'Tenho interesse neste imóvel!',
  property_id: 'ZAP-12345'
};

async function testWebhook() {
  console.log(`🚀 Simulando lead para: ${WEBHOOK_URL}...`);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleLead)
    });

    const result = await response.json();
    console.log('✅ Resposta do Webhook:', result);
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.log('NOTA: Certifique-se que o Supabase local está rodando (`npx supabase start`).');
  }
}

testWebhook();
