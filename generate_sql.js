import xlsx from 'xlsx';
import fs from 'fs';
import crypto from 'crypto';

const filePath = "Exportação_imóveis - 20260414_144223.xlsx";
const workbook = xlsx.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

// company_id must be dynamically replaced or use a known one. We will use a placeholder or subquery.
// Since we don't know the company ID, we'll assign it to the first company in the table.
let sql = `
DO $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Get the first company ID (assuming Canaa is the main/only company)
  SELECT id INTO v_company_id FROM public.companies LIMIT 1;
  
  IF v_company_id IS NULL THEN
     RAISE EXCEPTION 'Nenhuma company encontrada na base de dados';
  END IF;

`;

function cleanPrice(priceStr) {
  if (!priceStr) return 0;
  if (typeof priceStr === 'number') return priceStr;
  let str = String(priceStr).replace('R$', '').trim();
  str = str.replace(/\./g, '');
  str = str.replace(',', '.');
  return parseFloat(str) || 0;
}

function mapPropertyType(tipo) {
  if (!tipo) return 'casa';
  const t = tipo.toLowerCase();
  if (t.includes('apartamento')) return 'apartamento';
  if (t.includes('terreno') || t.includes('lote')) return 'terreno';
  if (t.includes('comercial')) return 'comercial';
  if (t.includes('cobertura')) return 'cobertura';
  if (t.includes('kitnet')) return 'kitnet';
  if (t.includes('rural') || t.includes('fazenda')) return 'rural';
  return 'casa';
}

for (const row of data) {
  const internal_id = row['código'] || '';
  const tipo = row['tipo'] || '';
  const property_type = mapPropertyType(tipo);
  
  const bairro = row['bairro'] || '';
  const cidade = row['cidade'] || '';
  const estado = row['estado'] || '';
  const rua = row['rua'] || '';
  const numero = row['número'] || '';
  const address = rua ? `${rua}, ${numero}` : '';
  
  const title = `${row['tipo'] || 'Imóvel'} em ${bairro || cidade}`.replace(/'/g, "''");
  
  const bedrooms = parseInt(row['quartos']) || 0;
  const bathrooms = parseInt(row['banheiros']) || 0;
  const parking_spots = parseInt(row['garagens']) || 0;
  const area_total = parseFloat(row['área_total']) || parseFloat(row['área_terreno']) || 0;
  
  const price = cleanPrice(row['valor_venda']);
  const transaction = (row['disponibilidade'] || '').toLowerCase().includes('locaç') ? 'aluguel' : 'venda';
  
  // They are active ones from export
  const status = 'disponivel';
  const is_published = true;
  
  const desc = `Ref: ${internal_id}. Proprietário: ${row['Nome proprietário 1'] || 'N/A'}. Telefone: ${row['Telefone proprietário 1'] || 'N/A'}`;
  
  // Use a deterministic UUID for updates/inserts based on internal_id
  
  sql += `
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '${String(internal_id).replace(/'/g, "''")}',
    '${title}',
    '${desc.replace(/'/g, "''")}',
    '${property_type}',
    '${transaction}',
    ${price},
    ${bedrooms},
    ${bathrooms},
    ${parking_spots},
    ${area_total},
    '${address.replace(/'/g, "''")}',
    '${bairro.replace(/'/g, "''")}',
    '${cidade.replace(/'/g, "''")}',
    '${estado.replace(/'/g, "''")}',
    '${status}',
    ${is_published}
  ) ON CONFLICT DO NOTHING;
  `;
}

sql += `\nEND $$;`;

fs.writeFileSync('import_imoveis.sql', sql);
console.log(`Generated import_imoveis.sql with ${data.length} records.`);
