/**
 * Script de importação v2: "lead jet imob - Worksheet.csv" → contacts
 * Parser robusto: suporta campos com quebras de linha dentro de aspas
 * 
 * Uso: node import_leads_imob.cjs
 */

const fs = require('fs');
const https = require('https');

// ─── Config ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://uscfxlmtqzqifizunyoz.supabase.co';
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ3NzA4NSwiZXhwIjoyMDkwMDUzMDg1fQ.2dzxljw8RjmYhXHDFGH84P4y6_fFWygeNoF83mT19Xo';
const CSV_FILE     = 'C:/Users/Suely/Downloads/lead jet imob - Worksheet.csv';
const COMPANY_ID   = '00000000-0000-0000-0000-000000000000';
const BATCH_SIZE   = 100;
const DELAY_MS     = 200;

// ─── HTTP Helper ───────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function supabaseFetch(path, method, body) {
  if (!method) method = 'GET';
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path);
    const opts = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'Prefer': 'return=minimal',
      },
    };
    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// ─── CSV Parser Robusto (suporta \n dentro de aspas) ──────────────────────────
function parseCSVRobust(content) {
  // normaliza \r\n → \n
  const text = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const rows = [];
  let i = 0;
  const len = text.length;

  function parseRow() {
    const fields = [];
    while (i <= len) {
      if (i >= len || text[i] === '\n') {
        // fim de linha
        i++; // avança o \n
        return fields;
      }
      if (text[i] === '"') {
        // campo com aspas
        i++; // pula a aspa de abertura
        let field = '';
        while (i < len) {
          if (text[i] === '"') {
            if (text[i + 1] === '"') {
              // aspas escapadas ""
              field += '"';
              i += 2;
            } else {
              // fim do campo com aspas
              i++; // pula a aspa de fechamento
              break;
            }
          } else {
            field += text[i];
            i++;
          }
        }
        fields.push(field.trim());
        // avança vírgula se houver
        if (text[i] === ',') i++;
      } else {
        // campo simples (sem aspas)
        let field = '';
        while (i < len && text[i] !== ',' && text[i] !== '\n') {
          field += text[i];
          i++;
        }
        fields.push(field.trim());
        if (text[i] === ',') i++;
      }
    }
    return fields;
  }

  // linha de cabeçalho
  const headers = parseRow();

  // linhas de dados
  while (i < len) {
    const fields = parseRow();
    if (fields.length === 0 || (fields.length === 1 && fields[0] === '')) continue;

    // linha válida: deve ter ao menos o mesmo número de campos que o header
    // (campos extras são ignorados, campos faltantes viram '')
    const row = {};
    headers.forEach((h, idx) => {
      row[h.trim()] = (fields[idx] || '').trim();
    });
    rows.push(row);
  }

  return rows;
}

// ─── Normalizar telefone ───────────────────────────────────────────────────────
function normalizePhone(phone) {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits || digits.length < 8) return null;
  if (digits.startsWith('55') && digits.length >= 12) return '+' + digits;
  if (digits.length === 11 || digits.length === 10) return '+55' + digits;
  if (digits.length >= 8) return '+55' + digits;
  return null;
}

// ─── Mapear linha CSV → contato Supabase ─────────────────────────────────────
// Colunas do CSV:
// Nome completo, Email 1, Email 2, Email 3, Telefone 1, Telefone 2, Telefone 3,
// Data de conversão, Finalidade, Imóvel de referencia, Agência, Nome responsável,
// Email responsavel, Equipe, Origem, Campanha, Temperatura do lead, Mensagem,
// Etiquetas, utm_id, utm_source, utm_medium, utm_campaign, utm_term, utm_content,
// gclid, fbclid, url

function mapRow(row) {
  // ── NOME ───────────────────────────────────────────────────────────────────
  const name = (row['Nome completo'] || '').trim();
  if (!name || name.length < 2) return null; // ignora linha sem nome válido

  // ── CONTATO ────────────────────────────────────────────────────────────────
  const email = row['Email 1'] || row['Email 2'] || row['Email 3'] || null;
  const phone = normalizePhone(
    row['Telefone 1'] || row['Telefone 2'] || row['Telefone 3'] || ''
  );

  // ── ORIGEM ─────────────────────────────────────────────────────────────────
  const origem   = row['Origem'] || '';
  const campanha = row['Campanha'] || '';
  const source   = [origem, campanha].filter(Boolean).join(' – ') || 'Lead Jet Imob';

  // ── TEMPERATURA → TAG ──────────────────────────────────────────────────────
  const tempVal = parseInt(row['Temperatura do lead'] || '0', 10);
  let tempTag = 'frio';
  if (tempVal >= 80)      tempTag = 'quente';
  else if (tempVal >= 40) tempTag = 'morno';

  // ── TAGS ───────────────────────────────────────────────────────────────────
  const tags = ['imóveis', 'lead-jet', tempTag];
  const finalidade = (row['Finalidade'] || '').toLowerCase();
  if (finalidade) tags.push(finalidade);

  // ── NOTAS ──────────────────────────────────────────────────────────────────
  const imovelRef = row['Imóvel de referencia'] || row['Im\u00f3vel de referencia'] || '';
  const noteParts = [];
  if (imovelRef) noteParts.push('Imóvel de referência: ' + imovelRef);
  // mensagem resumida (primeiros 400 chars)
  const msg = (row['Mensagem'] || '').replace(/\n/g, ' ').trim();
  if (msg) noteParts.push(msg.substring(0, 400));
  const notes = noteParts.join('\n') || null;

  // ── CAMPOS PERSONALIZADOS ──────────────────────────────────────────────────
  const custom_fields = {
    finalidade:        row['Finalidade'] || null,
    imovel_referencia: imovelRef || null,
    temperatura_lead:  tempVal || null,
    data_conversao:    row['Data de convers\u00e3o'] || row['Data de conversão'] || null,
    agencia:           row['Ag\u00eancia'] || row['Agência'] || null,
    responsavel:       row['Nome respons\u00e1vel'] || row['Nome responsável'] || null,
    equipe:            row['Equipe'] || null,
    campanha:          campanha || null,
    utm_source:        row['utm_source'] || null,
    utm_medium:        row['utm_medium'] || null,
    utm_campaign:      row['utm_campaign'] || null,
    url_anuncio:       row['url'] || null,
  };

  // Remove campos null do custom_fields
  Object.keys(custom_fields).forEach(k => {
    if (!custom_fields[k]) delete custom_fields[k];
  });

  return {
    company_id:    COMPANY_ID,
    name:          name.substring(0, 255),
    email:         email ? email.substring(0, 255) : null,
    phone:         phone,
    status:        'lead',
    source:        source.substring(0, 100),
    tags,
    notes,
    custom_fields,
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🚀  Importação v2 - com parser robusto\n');

  // 1. Ler CSV com encoding latin1 → converte para UTF-8 via TextDecoder
  console.log('📂  Lendo arquivo CSV...');
  const rawBuffer = fs.readFileSync(CSV_FILE);
  const content   = new TextDecoder('latin1').decode(rawBuffer);
  console.log('   Bytes lidos:', rawBuffer.length);

  // 2. Parser robusto
  console.log('🔍  Fazendo parse do CSV (modo multi-linha)...');
  const rows = parseCSVRobust(content);
  console.log('✅  Linhas lidas:', rows.length);

  // 3. Verificar amostra
  const sample = rows[0];
  console.log('\n📋  Amostra do primeiro lead:');
  console.log('   Nome:     ', sample['Nome completo']);
  console.log('   Email:    ', sample['Email 1']);
  console.log('   Telefone: ', sample['Telefone 1']);
  console.log('   Finalidade:', sample['Finalidade']);
  console.log('   Origem:   ', sample['Origem']);
  console.log();

  // 4. Mapear
  const contacts = rows.map(mapRow).filter(Boolean);
  console.log('🗂️   Contatos válidos para importar:', contacts.length);

  // Verificar amostra mapeada
  const c0 = contacts[0];
  console.log('\n✅  Amostra mapeada:');
  console.log('   name:    ', c0.name);
  console.log('   email:   ', c0.email);
  console.log('   phone:   ', c0.phone);
  console.log('   source:  ', c0.source);
  console.log('   tags:    ', c0.tags);
  console.log();

  // Confirmar se está correto antes de continuar
  // (script continua automaticamente)

  // 5. Importar em batches
  let inserted = 0, failed = 0, failDetails = [];
  const batches = Math.ceil(contacts.length / BATCH_SIZE);

  for (let i = 0; i < batches; i++) {
    const batch = contacts.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
    const res = await supabaseFetch('/rest/v1/contacts', 'POST', batch);

    if (res.status === 201 || res.status === 200) {
      inserted += batch.length;
    } else {
      // tenta individualmente para não perder nenhum
      for (const contact of batch) {
        const single = await supabaseFetch('/rest/v1/contacts', 'POST', [contact]);
        if (single.status === 201 || single.status === 200) {
          inserted++;
        } else {
          failed++;
          if (failDetails.length < 5) {
            failDetails.push({ name: contact.name, status: single.status, body: single.body });
          }
        }
        await sleep(50);
      }
    }

    // Progresso a cada 10 batches
    if ((i + 1) % 10 === 0 || i === batches - 1) {
      process.stdout.write('\r   Progresso: ' + ((i + 1) / batches * 100).toFixed(1) + '% (batch ' + (i+1) + '/' + batches + ')');
    }

    await sleep(DELAY_MS);
  }

  console.log('\n');
  console.log('─'.repeat(50));
  console.log('✅  Importados:  ' + inserted);
  console.log('❌  Com falha:   ' + failed);
  console.log('📊  Total:       ' + contacts.length);
  console.log('─'.repeat(50));

  if (failDetails.length > 0) {
    console.log('\n⚠️  Primeiras falhas:');
    failDetails.forEach(f => console.log('   -', f.name, '| status:', f.status, '| erro:', JSON.stringify(f.body)));
  }

  console.log('\n🎉  Importação concluída!');
}

main().catch((err) => {
  console.error('\n❌  Erro fatal:', err);
  process.exit(1);
});
