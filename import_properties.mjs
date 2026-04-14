import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { parse } from 'csv-parse/sync'

// ─── Config ────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://uscfxlmtqzqifizunyoz.supabase.co'
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzY2Z4bG10cXpxaWZpenVueW96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDQ3NzA4NSwiZXhwIjoyMDkwMDUzMDg1fQ.2dzxljw8RjmYhXHDFGH84P4y6_fFWygeNoF83mT19Xo'
const COMPANY_ID = '00000000-0000-0000-0000-000000000000'
const CSV_PATH = './lista de imoveis  - Worksheet.csv'
const BATCH_SIZE = 50

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ─── Helpers ───────────────────────────────────────────────────────────────
function parseBRL(value) {
  if (!value || value.trim() === '') return 0
  // "R$ 8.000.000,00" → 8000000.00
  return parseFloat(value.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.')) || 0
}

function parseArea(value) {
  if (!value || value.trim() === '') return null
  return parseFloat(value.replace(',', '.')) || null
}

function parseIntSafe(value) {
  if (!value || value.trim() === '') return null
  const n = parseInt(value)
  return isNaN(n) ? null : n
}

function mapListingType(disponibilidade) {
  const d = (disponibilidade || '').toLowerCase()
  if (d.includes('venda') && d.includes('locação')) return 'sale' // primary = sale
  if (d.includes('locação')) return 'rent'
  if (d.includes('temporada')) return 'vacation'
  if (d.includes('venda')) return 'sale'
  return 'sale'
}

function mapStatus(statusAtualizacao, motivo) {
  if (motivo && motivo.trim() !== '') return 'inactive' // has a reason to be hidden
  const s = (statusAtualizacao || '').toLowerCase()
  if (s === 'atualizado') return 'active'
  if (s === 'expirando') return 'active'
  if (s === 'desatualizado') return 'active' // still on market, just not recently updated
  return 'active'
}

function mapPropertyType(tipo) {
  const map = {
    'apartamento': 'Apartamento',
    'casa': 'Casa',
    'casa de condomínio': 'Casa de Condomínio',
    'terreno': 'Terreno',
    'fazenda': 'Fazenda',
    'pousada': 'Pousada',
    'sítio': 'Sítio',
    'chácara': 'Chácara',
    'cobertura': 'Cobertura',
    'lote': 'Lote',
    'sala': 'Sala Comercial',
    'loja': 'Loja',
    'galpão': 'Galpão',
  }
  const key = (tipo || '').toLowerCase().trim()
  return map[key] || tipo || 'Outro'
}

function parsePortalConfig(portaisStr) {
  const config = {
    zap: false,
    vivareal: false,
    imovelweb: false,
    luxury_estate: false,
    properstar: false,
    olx: false,
  }
  if (!portaisStr) return config
  const p = portaisStr.toLowerCase()
  if (p.includes('zap')) config.zap = true
  if (p.includes('viva real') || p.includes('vivareal')) config.vivareal = true
  if (p.includes('imovelweb')) config.imovelweb = true
  if (p.includes('luxuryestate') || p.includes('luxury estate')) config.luxury_estate = true
  if (p.includes('properstar')) config.properstar = true
  if (p.includes('olx')) config.olx = true
  return config
}

function buildAddress(rua, complemento, numero, bairro) {
  const parts = [rua, numero && numero !== '0' && numero !== '0000' ? numero : null, complemento].filter(Boolean)
  return parts.join(', ')
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('📂 Lendo CSV...')
  const raw = readFileSync(CSV_PATH, 'utf-8')

  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
    trim: true,
  })

  console.log(`✅ ${records.length} imóveis encontrados no CSV`)

  const properties = records.map((r) => {
    const price = parseBRL(r['valor_venda']) || parseBRL(r['valor_locação']) || 0
    const rentPrice = parseBRL(r['valor_locação'])

    return {
      company_id: COMPANY_ID,
      internal_id: r['código'] || null,
      title: `${mapPropertyType(r['tipo'])} - ${r['bairro'] || ''}, ${r['cidade'] || ''}`.trim(),
      property_type: mapPropertyType(r['tipo']),
      listing_type: mapListingType(r['disponibilidade']),
      price: price,
      condo_fee: parseBRL(r['valor_condomínio']),
      iptu: parseBRL(r['valor_iptu']),
      area: parseArea(r['área_privativa']) || parseArea(r['área_util']) || parseArea(r['área_total']) || null,
      bedrooms: parseIntSafe(r['quartos']),
      bathrooms: parseIntSafe(r['banheiros']),
      parking_spots: parseIntSafe(r['garagens']),
      address: buildAddress(r['rua'], r['complemento'], r['número'], r['bairro']),
      neighborhood: r['bairro'] || null,
      city: r['cidade'] || null,
      state: r['estado'] || null,
      status: mapStatus(r['status_atualização'], r['motivo_não_visível']),
      portal_config: parsePortalConfig(r['portais']),
      features: r['etiquetas'] ? r['etiquetas'].split(',').map(s => s.trim()).filter(Boolean) : [],
      custom_fields: {
        suites: parseIntSafe(r['suítes']),
        area_terreno: parseArea(r['área_terreno']),
        area_total: parseArea(r['área_total']),
        area_privativa: parseArea(r['área_privativa']),
        area_util: parseArea(r['área_util']),
        unidade_medida: r['unidade_medida'] || 'm²',
        condominio_id: r['id_condomínio'] || null,
        condominio_nome: r['nome_condomínio'] || null,
        responsavel: r['responsável'] || null,
        agenciador: r['agenciador'] || null,
        disponibilidade: r['disponibilidade'] || null,
        valor_locacao: rentPrice || null,
        data_cadastro: r['data_cadastro'] || null,
        data_agenciamento: r['data_agenciamento'] || null,
        proprietarios: r['proprietários'] ? (() => {
          try { return JSON.parse(r['proprietários']) } catch { return [] }
        })() : [],
      },
    }
  })

  // Insert in batches
  let inserted = 0
  let errors = 0

  for (let i = 0; i < properties.length; i += BATCH_SIZE) {
    const batch = properties.slice(i, i + BATCH_SIZE)
    const { error } = await supabase
      .from('properties')
      .insert(batch)

    if (error) {
      console.error(`❌ Erro no batch ${i}-${i + BATCH_SIZE}:`, error.message)
      errors += batch.length
    } else {
      inserted += batch.length
      process.stdout.write(`\r⏳ Inseridos: ${inserted}/${properties.length}`)
    }
  }

  console.log(`\n\n🎉 Importação concluída!`)
  console.log(`   ✅ Inseridos com sucesso: ${inserted}`)
  if (errors > 0) console.log(`   ❌ Com erro: ${errors}`)
}

main().catch(console.error)
