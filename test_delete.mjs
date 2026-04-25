import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ3NzA4NSwiZXhwIjoyMDkwMDUzMDg1fQ.2dzxljw8RjmYhXHDFGH84P4y6_fFWygeNoF83mT19Xo';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function testDelete() {
  const testId = '8ec9e3f9-e4fe-4bf6-b3c9-f84153a0b704'; // One of the Brookiln apts

  console.log(`Tentando deletar imóvel ID: ${testId}`);

  const { data, error } = await supabase
    .from('properties')
    .delete()
    .eq('id', testId)
    .select(); // important to return what was deleted

  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log('✅ Retorno da deleção:', data);
  }
}

testDelete();
