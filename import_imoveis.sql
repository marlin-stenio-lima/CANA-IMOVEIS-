
DO $$
DECLARE
  v_company_id uuid;
BEGIN
  -- Get the first company ID (assuming Canaa is the main/only company)
  SELECT id INTO v_company_id FROM public.companies LIMIT 1;
  
  IF v_company_id IS NULL THEN
     RAISE EXCEPTION 'Nenhuma company encontrada na base de dados';
  END IF;


  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3815',
    'Casa em Ilha da Gipóia',
    'Ref: 3815. Proprietário: Haroldo. Telefone:  +5565999406005',
    'casa',
    'venda',
    8000000,
    5,
    3,
    0,
    42000,
    'Ilha da Gipóia, 0000',
    'Ilha da Gipóia',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5005',
    'Terreno em Ilha da Gipóia',
    'Ref: 5005. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'terreno',
    'venda',
    1800000,
    0,
    0,
    0,
    12000,
    'Baía da Ribeira, 0000',
    'Ilha da Gipóia',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF290224',
    'Apartamento em Praia do Forte',
    'Ref: LC-LCF290224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    950000,
    3,
    2,
    1,
    12000,
    'Avenida do Contorno, 300',
    'Praia do Forte',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF130224',
    'Apartamento em Praia do Forte',
    'Ref: LC-LCF130224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1300000,
    3,
    1,
    1,
    12000,
    'Avenida Macário Pinto Lopes, 280',
    'Praia do Forte',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF190224',
    'Apartamento em Praia do Forte',
    'Ref: LC-LCF190224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    2500000,
    4,
    4,
    3,
    12000,
    'Avenida Litorânea, 200',
    'Praia do Forte',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF110224',
    'Apartamento em Praia do Forte',
    'Ref: LC-LCF110224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    990000,
    3,
    3,
    1,
    100,
    'Avenida Macário Pinto Lopes, 1',
    'Praia do Forte',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF210324',
    'Apartamento em Praia do Forte',
    'Ref: LC-LCF210324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    3000000,
    3,
    4,
    2,
    12000,
    'Avenida do Contorno, 6',
    'Praia do Forte',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4049',
    'Casa de Condomínio em Pantanal',
    'Ref: 4049. Proprietário: Renata Yammine Laranjeiras Leticia. Telefone:  +5514996342908',
    'casa',
    'venda',
    0,
    4,
    5,
    4,
    12000,
    '12, 07',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5846',
    'Fazenda em Pantanal',
    'Ref: 5846. Proprietário: JANICE. Telefone:  +5521990837787',
    'rural',
    'venda',
    60000000,
    2,
    2,
    0,
    236,
    'Rio Santos, ',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8305',
    'Casa em Pantanal',
    'Ref: 8305. Proprietário: Yara Proprietária Casa Caborê Paraty. Telefone:  +5511993996988',
    'casa',
    'venda',
    4900000,
    3,
    3,
    5,
    1509,
    'Caboré, 1',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9756',
    'Casa em Pantanal',
    'Ref: 9756. Proprietário: Denise Casa Paraty. Telefone:  +5511945121177',
    'casa',
    'venda',
    12500000,
    5,
    6,
    5,
    2000,
    'Avenida Octávio Gama, 0000',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4152',
    'Casa em Pantanal',
    'Ref: 4152. Proprietário: Yara Proprietária Casa Caborê Paraty. Telefone:  +5511993996988',
    'casa',
    'venda',
    6500000,
    5,
    3,
    5,
    1509.08,
    'Caborê, 0000',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4698',
    'Casa em Pantanal',
    'Ref: 4698. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    60000000,
    5,
    7,
    0,
    1509.08,
    '12, 07',
    'Pantanal',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9887',
    'Fazenda em Centro de São VIcente',
    'Ref: 9887. Proprietário: Victor Raposo. Telefone:  +5521988200290',
    'rural',
    'venda',
    9100000,
    3,
    3,
    10,
    500,
    'Fazenda, 0000',
    'Centro de São VIcente',
    'Araruama',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9708',
    'Apartamento em Brookiln',
    'Ref: 9708. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    4200000,
    2,
    3,
    2,
    252,
    'Rua Flórida, 1901',
    'Brookiln',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2970',
    'Apartamento em Brookiln',
    'Ref: 2970. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    4200000,
    2,
    3,
    2,
    252,
    'Rua Flórida, 1901',
    'Brookiln',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8990',
    'Apartamento em Brookiln',
    'Ref: 8990. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    4200000,
    2,
    3,
    2,
    252,
    'Rua Flórida, 1901',
    'Brookiln',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA250221',
    'Casa em Praia do Canto',
    'Ref: LC-LA250221. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    25000000,
    9,
    12,
    2,
    600,
    'Rua Maria Joaquina, 190',
    'Praia do Canto',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5345',
    'Pousada em Zona Rural',
    'Ref: 5345. Proprietário: MIRIANE. Telefone:  +5521999443355',
    'casa',
    'venda',
    2800000,
    9,
    10,
    10,
    450,
    'RUA DOS JAMBOS, 59',
    'Zona Rural',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3974',
    'Casa de Condomínio em Zona Rural',
    'Ref: 3974. Proprietário: Danilo Santoni. Telefone:  +5521980837272',
    'casa',
    'venda',
    0,
    8,
    10,
    5,
    3747,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7373',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7373. Proprietário: Juan. Telefone:  +5521988437046',
    'casa',
    'venda',
    25000000,
    12,
    11,
    8,
    7999.95,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4628',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4628. Proprietário: Jaime Portugal Prop. Casa Portobello. Telefone:  +5521999823629',
    'casa',
    'venda',
    11000000,
    6,
    8,
    5,
    4000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5570',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5570. Proprietário: Marcelo Duarte. Telefone:  +5521983275212',
    'casa',
    'venda',
    4500000,
    7,
    8,
    3,
    820,
    'Unnamed Road - Conceição de Jacareí, 000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2535',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2535. Proprietário: Paulo Sergio. Telefone:  +5521964065341',
    'casa',
    'venda',
    8500000,
    5,
    7,
    4,
    2551.59,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6672',
    'Casa de Condomínio em Zona Rural',
    'Ref: 6672. Proprietário: Rita Portobello Casa H1 17. Telefone:  +5521964136895',
    'casa',
    'venda',
    16000000,
    10,
    8,
    8,
    2551.59,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5452',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5452. Proprietário: Marcelo Proprietário N2A30. Telefone:  +5521992225900',
    'casa',
    'venda',
    10000000,
    5,
    2,
    5,
    2000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5555',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5555. Proprietário: Adriano Cardozo. Telefone:  +5513981602470',
    'casa',
    'venda',
    12000000,
    5,
    8,
    1,
    1800,
    '000, 00000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2640',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2640. Proprietário: Perigris casa 5 laranja. Telefone:  +5521999822130',
    'casa',
    'venda',
    6000000,
    4,
    6,
    3,
    1000.02,
    'casa, 000000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6806',
    'Casa de Condomínio em Zona Rural',
    'Ref: 6806. Proprietário: Marisete Almeida. Telefone:  +5521967627388',
    'casa',
    'venda',
    28000000,
    9,
    10,
    7,
    2823,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9333',
    'Casa de Condomínio em Zona Rural',
    'Ref: 9333. Proprietário: Claúdio. Telefone:  +5521998062368',
    'casa',
    'venda',
    6500000,
    5,
    6,
    3,
    2823,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7233',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7233. Proprietário: Ernesto Proprietário Portobello. Telefone:  +351964239344',
    'casa',
    'venda',
    19000000,
    6,
    7,
    6,
    6540,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5723',
    'Terreno em Zona Rural',
    'Ref: 5723. Proprietário: Elaine. Telefone:  +5524999959990',
    'terreno',
    'venda',
    1600000,
    0,
    0,
    0,
    1700,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1153',
    'Casa de Condomínio em Zona Rural',
    'Ref: 1153. Proprietário: Casa Sitio Bom( Gabriela). Telefone:  +5521997408660',
    'casa',
    'venda',
    2900000,
    4,
    5,
    2,
    398,
    'casa, 0000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9440',
    'Terreno em Zona Rural',
    'Ref: 9440. Proprietário: Inácio Naná. Telefone:  +5521999860018',
    'terreno',
    'venda',
    8500000,
    0,
    0,
    0,
    5680,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4672',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4672. Proprietário: Sr.Anderson. Telefone:  +5561992716267',
    'casa',
    'venda',
    25000000,
    5,
    7,
    0,
    1640,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6604',
    'Casa de Condomínio em Zona Rural',
    'Ref: 6604. Proprietário: André Kiffer. Telefone:  +5521971953076',
    'casa',
    'venda',
    10000000,
    7,
    9,
    10,
    6878,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7106',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7106. Proprietário: Juca Arruda Casa Itaorca. Telefone:  +5511975971013',
    'casa',
    'venda',
    6000000,
    4,
    4,
    3,
    6878,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5547',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5547. Proprietário: Luiz. Telefone:  +5521999836481',
    'casa',
    'venda',
    12000000,
    6,
    7,
    4,
    3000,
    'Unnamed Road - Conceição de Jacareí, 000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6787',
    'Casa de Condomínio em Zona Rural',
    'Ref: 6787. Proprietário: Mario Faria. Telefone:  +5521971226255',
    'casa',
    'venda',
    12000000,
    5,
    5,
    3,
    2000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2540',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2540. Proprietário: Elizabeth Mendes Tavares. Telefone:  +5524999665101',
    'casa',
    'venda',
    4200000,
    5,
    6,
    6,
    700,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '29619',
    'Casa de Condomínio em Zona Rural',
    'Ref: 29619. Proprietário: José Carlos Dutra. Telefone:  +5521993271550',
    'casa',
    'venda',
    1400000,
    3,
    2,
    3,
    170,
    'Rodovia Rio Santos, Conceição de Jacareí S/N, S/n',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4104',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4104. Proprietário: Jorge SkyPar. Telefone:  +5521994008442',
    'casa',
    'venda',
    30000000,
    6,
    7,
    4,
    1200,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4910',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4910. Proprietário: Ana Vives Casa Village  Porto Belo. Telefone:  +5519998983037',
    'casa',
    'venda',
    4400000,
    4,
    2,
    2,
    1200,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7504',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7504. Proprietário: Victor Hugo. Telefone:  +5521967837356',
    'casa',
    'venda',
    12700000,
    6,
    8,
    4,
    1900,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9912',
    'Casa de Condomínio em Zona Rural',
    'Ref: 9912. Proprietário: Renato Cliente Bahia. Telefone:  +5521999862829',
    'casa',
    'venda',
    5500000,
    5,
    6,
    0,
    1200,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '22531',
    'Casa de Condomínio em Zona Rural',
    'Ref: 22531. Proprietário: Hebert Carvalho. Telefone:  +5521997267575',
    'casa',
    'venda',
    2200000,
    4,
    3,
    5,
    400,
    'Condomínio Píer 51, rodovia Rio Santos s/n km 51 Conceição de Jacareí, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-7727',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-7727. Proprietário: janir administrador. Telefone:  +5521981435155',
    'casa',
    'venda',
    16800000,
    7,
    10,
    20,
    5400,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6972',
    'Casa de Condomínio em Zona Rural',
    'Ref: 6972. Proprietário: Carla Cavende. Telefone:  +5521999771990',
    'casa',
    'venda',
    16000000,
    5,
    7,
    4,
    5400,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8437',
    'Casa de Condomínio em Zona Rural',
    'Ref: 8437. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    21000000,
    13,
    18,
    20,
    35000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-4628',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-4628. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    11000000,
    6,
    8,
    5,
    4000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-6787',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-6787. Proprietário: Mario Faria. Telefone:  +5521971226255',
    'casa',
    'venda',
    10000000,
    5,
    5,
    3,
    2000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-8437',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-8437. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    21000000,
    13,
    18,
    20,
    35000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4600',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4600. Proprietário: Bispo Eduardo K1A. Telefone:  +5521970195980',
    'casa',
    'venda',
    19000000,
    5,
    6,
    0,
    35000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7259',
    'Casa em Zona Rural',
    'Ref: 7259. Proprietário: Daniella Sol porto. Telefone:  +5521998881514',
    'casa',
    'venda',
    20000000,
    10,
    9,
    0,
    35000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-2367',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-2367. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    33000000,
    6,
    8,
    4,
    35000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5818',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5818. Proprietário: Ricardo. Telefone:  +5521970018928',
    'casa',
    'venda',
    3500000,
    5,
    6,
    20,
    1200,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1511',
    'Casa de Condomínio em Zona Rural',
    'Ref: 1511. Proprietário: Nayla. Telefone:  +5521988138713',
    'casa',
    'aluguel',
    19999900,
    5,
    8,
    10,
    5000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-5692',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-5692. Proprietário: edineia matos proprietaria portobello lote 40. Telefone:  +5511979601655',
    'casa',
    'venda',
    7499990,
    5,
    7,
    8,
    5000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7899',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7899. Proprietário: Soares. Telefone:  +5521964729200',
    'casa',
    'venda',
    11000000,
    6,
    5,
    3,
    5000,
    '000, 00000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2797',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2797. Proprietário: Marcelo Figueiredo Casa Portobello. Telefone:  +5521994279075',
    'casa',
    'venda',
    20000000,
    6,
    8,
    10,
    1000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4486',
    'Casa de Condomínio em Zona Rural',
    'Ref: 4486. Proprietário: Flávia Prop. Casa Temporada. Telefone:  +5521981055856',
    'casa',
    'venda',
    0,
    6,
    7,
    2,
    6015,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3341',
    'Terreno em Zona Rural',
    'Ref: 3341. Proprietário: Elizabeth Mendes Tavares. Telefone:  +5524999665101',
    'terreno',
    'venda',
    850000,
    0,
    0,
    0,
    1082,
    'Cond. Itaoca, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2907',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2907. Proprietário: Jorge SkyPar. Telefone:  +5521994008442',
    'casa',
    'venda',
    10900000,
    6,
    8,
    2,
    800,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-1511',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-1511. Proprietário: carem. Telefone:  +5524999939995',
    'casa',
    'aluguel',
    19999000,
    5,
    8,
    10,
    5000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9066',
    'Terreno em Zona Rural',
    'Ref: 9066. Proprietário: Ana Lúcia. Telefone:  +5521999847392',
    'terreno',
    'venda',
    2000000,
    0,
    0,
    0,
    2080,
    '000, 00000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7727',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7727. Proprietário: janir administrador. Telefone:  +5521981435155',
    'casa',
    'venda',
    18000000,
    7,
    10,
    20,
    5400,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6050',
    'Casa em Zona Rural',
    'Ref: 6050. Proprietário: Mauro Vitor. Telefone:  +5511996312470',
    'casa',
    'venda',
    18000000,
    21,
    23,
    50,
    6500,
    'Rua Prof. Humberto Teixeira, 637',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-8188',
    'Casa de Condomínio em Zona Rural',
    'Ref: DUP-8188. Proprietário: sandra proprietaria portobello ilha 16. Telefone:  +5521971364627',
    'casa',
    'venda',
    11999900,
    6,
    10,
    6,
    2600,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8188',
    'Casa de Condomínio em Zona Rural',
    'Ref: 8188. Proprietário: sandra proprietaria portobello ilha 16. Telefone:  +5521971364627',
    'casa',
    'venda',
    11999900,
    6,
    10,
    6,
    2600,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5692',
    'Casa de Condomínio em Zona Rural',
    'Ref: 5692. Proprietário: edineia matos proprietaria portobello lote 40. Telefone:  +5511979601655',
    'casa',
    'venda',
    9000000,
    5,
    7,
    8,
    2600,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9818',
    'Terreno em Zona Rural',
    'Ref: 9818. Proprietário: Nayla. Telefone:  +5521988138713',
    'terreno',
    'venda',
    2500000,
    0,
    0,
    0,
    6763,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7161',
    'Terreno em Zona Rural',
    'Ref: 7161. Proprietário: Nayla. Telefone:  +5521988138713',
    'terreno',
    'venda',
    2500000,
    0,
    0,
    0,
    9224,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3371',
    'Casa de Condomínio em Zona Rural',
    'Ref: 3371. Proprietário: Matheus Stauss. Telefone:  +5521998846566',
    'casa',
    'venda',
    7000000,
    5,
    6,
    2,
    9224,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7976',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7976. Proprietário: alesandro caseiro. Telefone:  +5521970362834',
    'casa',
    'venda',
    19000000,
    7,
    8,
    6,
    8000,
    '000, 00000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7531',
    'Casa de Condomínio em Zona Rural',
    'Ref: 7531. Proprietário: Marcia Stockler. Telefone:  +5521996170713',
    'casa',
    'venda',
    6930000,
    5,
    6,
    4,
    8000,
    '000, 00000',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2367',
    'Casa de Condomínio em Zona Rural',
    'Ref: 2367. Proprietário: Sr Marcos. Telefone:  +5521998052121',
    'casa',
    'venda',
    33000000,
    6,
    8,
    4,
    8000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9503',
    'Casa de Condomínio em Zona Rural',
    'Ref: 9503. Proprietário: Guilherme Parceiro. Telefone:  +5524999232733',
    'casa',
    'venda',
    9800000,
    4,
    5,
    4,
    8000,
    'Portobello, ',
    'Zona Rural',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA050721',
    'Casa em Zona Rural',
    'Ref: LC-LA050721. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3350000,
    4,
    6,
    3,
    10000,
    'sem nome, 7',
    'Zona Rural',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF230725',
    'Apartamento em Algodoal',
    'Ref: LC-LCF230725. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1950000,
    4,
    3,
    2,
    8000,
    'Avenida Macário Pinto Lopes, 300',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF130324',
    'Cobertura em Algodoal',
    'Ref: LC-LCF130324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    2750000,
    4,
    4,
    4,
    320,
    'Rua John Kenedy, 64',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF300124',
    'Apartamento em Algodoal',
    'Ref: LC-LCF300124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    950000,
    3,
    2,
    2,
    150,
    'Rua John Kenedy, 58',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LCF280224',
    'Apartamento em Algodoal',
    'Ref: LCF280224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1150000,
    3,
    2,
    2,
    8000,
    'Rua Mercúrio, 87',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF260324',
    'Cobertura em Algodoal',
    'Ref: LC-LCF260324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    2600000,
    4,
    4,
    4,
    320,
    'Rua John Kenedy, 64',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF180324',
    'Cobertura em Algodoal',
    'Ref: LC-LCF180324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1500000,
    4,
    3,
    1,
    8000,
    'Rua Natanael Ribeiro de Almeida, 147',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF200324',
    'Apartamento em Algodoal',
    'Ref: LC-LCF200324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    950000,
    4,
    2,
    2,
    180,
    'Rua Alex Novelino, 405',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF100324',
    'Cobertura em Algodoal',
    'Ref: LC-LCF100324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1300000,
    4,
    4,
    3,
    209,
    'Rua Alex Novelino, 400',
    'Algodoal',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA200922',
    'Apartamento em Braga',
    'Ref: LC-LA200922. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    2700000,
    4,
    5,
    2,
    8000,
    'SEM NOME, 1234',
    'Braga',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF160124',
    'Apartamento em Braga',
    'Ref: LC-LCF160124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1500000,
    3,
    2,
    2,
    140,
    'Rua G, 0000',
    'Braga',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF280324',
    'Cobertura em Braga',
    'Ref: LC-LCF280324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1250000,
    3,
    4,
    2,
    8000,
    'Rua da Luz, 1151',
    'Braga',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF030324',
    'Apartamento em Centro',
    'Ref: LC-LCF030324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1300000,
    3,
    2,
    2,
    8000,
    'Rua Tamoios, 495',
    'Centro',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF050324',
    'Cobertura em Centro',
    'Ref: LC-LCF050324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1400000,
    3,
    4,
    2,
    8000,
    'Rua Jorge Lossio, 925',
    'Centro',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF120224',
    'Cobertura em Centro',
    'Ref: LC-LCF120224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    2000000,
    4,
    2,
    2,
    8000,
    'Rua Meira Júnior, 200',
    'Centro',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF050224',
    'Cobertura em Itajuru',
    'Ref: LC-LCF050224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1150000,
    4,
    5,
    2,
    200,
    'Rua Mario Quintanilha, 584',
    'Itajuru',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF081223',
    'Casa de Condomínio em Peró',
    'Ref: LC-LCF081223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2700000,
    4,
    4,
    2,
    300,
    'Rua Moinho, 0037',
    'Peró',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA310523',
    'Casa de Condomínio em Peró',
    'Ref: LC-LA310523. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    940000,
    3,
    4,
    2,
    300,
    'Rua do Guriri, 2090',
    'Peró',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF250324',
    'Casa de Condomínio em Peró',
    'Ref: LC-LCF250324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2500000,
    5,
    7,
    4,
    360,
    'Estrada do Guriri, ',
    'Peró',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220723',
    'Casa de Condomínio em Peró',
    'Ref: LC-LA220723. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3900000,
    5,
    7,
    3,
    615,
    'SEM NOME, 2314',
    'Peró',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF0905252',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF0905252. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2090000,
    4,
    5,
    4,
    380,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF110525',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF110525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1690000,
    4,
    4,
    4,
    368.21,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF170525',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF170525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2850000,
    5,
    7,
    4,
    380,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF220725',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF220725. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2290000,
    4,
    5,
    4,
    380,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ280525',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LBZ280525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1500000,
    3,
    3,
    4,
    360,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF280625',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF280625. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1800000,
    4,
    5,
    4,
    412,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ290525',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LBZ290525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1800000,
    4,
    5,
    4,
    378,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF120125',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF120125. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1300000,
    3,
    4,
    2,
    360,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF200425',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF200425. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2300000,
    3,
    4,
    2,
    360,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF210425',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF210425. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1500000,
    4,
    5,
    2,
    361.5,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA240725',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LA240725. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1350000,
    3,
    4,
    2,
    8000,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF181123',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF181123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1490000,
    2,
    3,
    4,
    422,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF260124',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF260124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2950000,
    3,
    3,
    2,
    360,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF1004241',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF1004241. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1250000,
    3,
    3,
    3,
    379.99,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA171022',
    'Casa em Ogiva',
    'Ref: LC-LA171022. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3890000,
    4,
    6,
    4,
    1200,
    'SEM NOME, 2134',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF050124',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF050124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1990000,
    4,
    4,
    3,
    380.01,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF180923',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF180923. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1750000,
    4,
    6,
    3,
    360,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF120124',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF120124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1500000,
    5,
    6,
    4,
    385,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF070624',
    'Casa de Condomínio em Ogiva',
    'Ref: LC-LCF070624. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1890000,
    4,
    4,
    4,
    380,
    'Estrada Deodoro de Azevedo, 4807',
    'Ogiva',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF170824',
    'Casa em Palmeiras',
    'Ref: LC-LCF170824. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    5,
    5,
    6,
    20592,
    'L, 9',
    'Palmeiras',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF200224',
    'Terreno em Palmeiras',
    'Ref: LC-LCF200224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    1400000,
    0,
    0,
    0,
    8000,
    'Rua Olinda, 7',
    'Palmeiras',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF070224',
    'Apartamento em Palmeiras',
    'Ref: LC-LCF070224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    650000,
    2,
    0,
    1,
    101,
    'Rua Teresina, 757',
    'Palmeiras',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF250124',
    'Casa em Praia do Siqueira',
    'Ref: LC-LCF250124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2300000,
    4,
    5,
    2,
    890,
    'Avenida América Central, 1999',
    'Praia do Siqueira',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA010423',
    'Casa de Condomínio em Passagem',
    'Ref: LC-LA010423. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7500000,
    9,
    10,
    10,
    1591,
    'Av Nossa Senhora da Assunção, 5554534',
    'Passagem',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF150224',
    'Cobertura em Passagem',
    'Ref: LC-LCF150224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    3100000,
    6,
    7,
    6,
    402,
    'Rua Elpídio Barbosa dos Santos, 0000',
    'Passagem',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF100123',
    'Cobertura em Passagem',
    'Ref: LC-LCF100123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1100000,
    3,
    3,
    2,
    8000,
    'Rua Barão do Rio Branco, 370',
    'Passagem',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF080324',
    'Cobertura em Passagem',
    'Ref: LC-LCF080324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    3000000,
    5,
    1,
    3,
    8000,
    'e, 2',
    'Passagem',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF150124',
    'Casa em Passagem',
    'Ref: LC-LCF150124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1800000,
    3,
    3,
    3,
    305,
    'Rua Capitão Augusto Lourenço, 128',
    'Passagem',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF010224',
    'Casa em Portinho',
    'Ref: LC-LCF010224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1500000,
    3,
    4,
    2,
    250,
    'Rua Coronel Ferreira, 525',
    'Portinho',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF280124',
    'Casa em Portinho',
    'Ref: LC-LCF280124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1850000,
    3,
    4,
    2,
    372,
    'Rua Granito, 183',
    'Portinho',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA020922',
    'Casa de Condomínio em Portinho',
    'Ref: LC-LA020922. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4900000,
    3,
    4,
    2,
    923,
    'SEM NOME, 123',
    'Portinho',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA290622',
    'Casa de Condomínio em São Bento',
    'Ref: LC-LA290622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6900000,
    5,
    6,
    6,
    2090,
    'MORINGA, 1',
    'São Bento',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LCF170124',
    'Apartamento em Vila Nova',
    'Ref: LCF170124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    900000,
    3,
    2,
    2,
    8000,
    'Rua Alex Novelino, 379',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF080224',
    'Apartamento em Vila Nova',
    'Ref: LC-LCF080224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1200000,
    3,
    3,
    2,
    150,
    'Rua Francisco Paranhos, 327',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF240124',
    'Cobertura em Vila Nova',
    'Ref: LC-LCF240124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    985000,
    5,
    3,
    1,
    140,
    'Rua Mercúrio, 113',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF070324',
    'Cobertura em Vila Nova',
    'Ref: LC-LCF070324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1250000,
    4,
    4,
    1,
    250,
    'Rua Sergipe, 450',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF030424',
    'Apartamento em Vila Nova',
    'Ref: LC-LCF030424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    1060000,
    3,
    3,
    2,
    8000,
    'Rua Alex Novelino, 420',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF220324',
    'Apartamento em Vila Nova',
    'Ref: LC-LCF220324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'apartamento',
    'venda',
    980000,
    3,
    3,
    2,
    120,
    'Rua Mercúrio, ',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF080424',
    'Cobertura em Vila Nova',
    'Ref: LC-LCF080424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    940000,
    4,
    4,
    1,
    250,
    'Rua Sergipe, 450',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF110124',
    'Cobertura em Vila Nova',
    'Ref: LC-LCF110124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'cobertura',
    'venda',
    1900000,
    4,
    4,
    3,
    255,
    'Rua Sergipe, 436',
    'Vila Nova',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5030',
    'Apartamento em Barra da Tijuca',
    'Ref: 5030. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'apartamento',
    'venda',
    940000,
    3,
    4,
    2,
    8000,
    'Avenida Djalma Ribeiro, 20',
    'Barra da Tijuca',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4898',
    'Apartamento em Barra da Tijuca',
    'Ref: 4898. Proprietário: Andre Magalhães. Telefone:  +5521981285257',
    'apartamento',
    'venda',
    4317500,
    1,
    2,
    2,
    8000,
    'Avenida Lúcio Costa, 00',
    'Barra da Tijuca',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4677',
    'Cobertura em Barra da Tijuca',
    'Ref: 4677. Proprietário: Gigi Carvalho. Telefone:  +5521999853939',
    'cobertura',
    'venda',
    4800000,
    4,
    5,
    3,
    400,
    'Rua Oswaldo Paes, 370',
    'Barra da Tijuca',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '44180',
    'Apartamento em Copacabana',
    'Ref: 44180. Proprietário: Elizabeth Vieira dos Santos. Telefone:  +5521985550283',
    'apartamento',
    'venda',
    1900000,
    3,
    2,
    1,
    8000,
    'Rua Figueiredo Magalhães, 421',
    'Copacabana',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2154',
    'Apartamento em Ipanema',
    'Ref: 2154. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'apartamento',
    'venda',
    18200000,
    4,
    4,
    2,
    8000,
    'Avenida Vieira Souto, ',
    'Ipanema',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1090',
    'Casa de Condomínio em Itanhangá',
    'Ref: 1090. Proprietário: janir administrador. Telefone:  +5521981435155',
    'casa',
    'venda',
    12800000,
    5,
    5,
    4,
    8000,
    'Rua Carlos Luiz Bandeira Stampa, 0000',
    'Itanhangá',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6099',
    'Apartamento em Recreio dos Bandeirantes',
    'Ref: 6099. Proprietário: Luciano. Telefone:  +5521964175018',
    'apartamento',
    'venda',
    698000,
    2,
    1,
    0,
    8000,
    'Avenida José Luiz Ferraz, 135',
    'Recreio dos Bandeirantes',
    'Rio de Janeiro',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'M-CAR',
    'Casa de Condomínio em Tabatinga',
    'Ref: M-CAR. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    16900000,
    7,
    8,
    2,
    8000,
    'Rodovia Rio-Santos, 379',
    'Tabatinga',
    'Caraguatatuba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7212',
    'Casa de Condomínio em Tabatinga',
    'Ref: 7212. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    15900000,
    7,
    8,
    2,
    8000,
    'Rodovia Rio-Santos, 379',
    'Tabatinga',
    'Caraguatatuba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8618',
    'Triplex em Itaim Bibi',
    'Ref: 8618. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'aluguel',
    12000000,
    2,
    3,
    2,
    8000,
    'Rua Oscar Pereira da Silva, 103',
    'Itaim Bibi',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8303',
    'Apartamento em Itaim Bibi',
    'Ref: 8303. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    6500000,
    3,
    3,
    3,
    8000,
    'Rua Itacema, 65',
    'Itaim Bibi',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1454',
    'Cobertura em Itaim Bibi',
    'Ref: 1454. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'cobertura',
    'aluguel',
    7100000,
    3,
    2,
    3,
    8000,
    'Rua Professor Benedito de Souza Aranha, 0000',
    'Itaim Bibi',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5706',
    'Cobertura em Pinheiros',
    'Ref: 5706. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'cobertura',
    'aluguel',
    4200000,
    1,
    2,
    1,
    8000,
    'Rua Oscar Freire, 1375',
    'Pinheiros',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3072',
    'Cobertura em Pinheiros',
    'Ref: 3072. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'cobertura',
    'aluguel',
    4500000,
    2,
    3,
    2,
    8000,
    'Rua Oscar Freire, 1375',
    'Pinheiros',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2628',
    'Cobertura em Pinheiros',
    'Ref: 2628. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'cobertura',
    'aluguel',
    4500000,
    2,
    3,
    2,
    8000,
    'Rua Oscar Freire, 1375',
    'Pinheiros',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9373',
    'Apartamento em Pinheiros',
    'Ref: 9373. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    9500000,
    3,
    4,
    2,
    8000,
    'Avenida Rebouças, 2880',
    'Pinheiros',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4842',
    'Cobertura em Real Parque',
    'Ref: 4842. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'cobertura',
    'aluguel',
    15500000,
    4,
    4,
    4,
    8000,
    'Marginal Pinheiros, 14.5',
    'Real Parque',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9196',
    'Duplex em Vila Nova Conceição',
    'Ref: 9196. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'aluguel',
    7500000,
    2,
    3,
    3,
    8000,
    'Avenida Presidente Juscelino Kubitschek, 1545',
    'Vila Nova Conceição',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '24393',
    'Duplex em Vila Olímpia',
    'Ref: 24393. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'aluguel',
    5500000,
    2,
    3,
    2,
    8000,
    'Rua Chilon, 184',
    'Vila Olímpia',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6170',
    'Apartamento em Vila Olímpia',
    'Ref: 6170. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'apartamento',
    'aluguel',
    19800000,
    3,
    3,
    4,
    8000,
    'Rua das Michel Milan, 125',
    'Vila Olímpia',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1024',
    'Duplex em Vila Olímpia',
    'Ref: 1024. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'aluguel',
    5500000,
    2,
    3,
    2,
    8000,
    'Rua Chilon, 184',
    'Vila Olímpia',
    'São Paulo',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1289',
    'Casa de Condomínio em Tamboré',
    'Ref: 1289. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    45000000,
    9,
    10,
    6,
    8000,
    'Praça China, 648',
    'Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'MAPA-9681',
    'Casa de Condomínio em Tamboré',
    'Ref: MAPA-9681. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    78000000,
    9,
    10,
    8,
    3110,
    'Praça China, 648',
    'Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'M-SP-A-81',
    'Casa de Condomínio em Tamboré',
    'Ref: M-SP-A-81. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    120000000,
    6,
    10,
    18,
    3110,
    'Praça China, 648',
    'Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7815',
    'Casa de Condomínio em Tamboré',
    'Ref: 7815. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    45000000,
    8,
    10,
    6,
    3110,
    'Praça China, 648',
    'Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2205',
    'Casa em Centro',
    'Ref: 2205. Proprietário: Sr.Fran. Telefone:  +5524999539338',
    'casa',
    'venda',
    28000000,
    6,
    7,
    0,
    3110,
    'Ilha comprida, 99',
    'Centro',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6761',
    'Casa em Centro',
    'Ref: 6761. Proprietário: Sandra Ilha. Telefone:  +5511985163600',
    'casa',
    'venda',
    10000000,
    2,
    1,
    0,
    58000,
    'Ilha grande, 22',
    'Centro',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '447',
    'Casa em Centro',
    'Ref: 447. Proprietário: Valcir. Telefone:  +5524992312903',
    'casa',
    'venda',
    0,
    9,
    9,
    0,
    58000,
    'Ilha dos coqueiros, 00',
    'Centro',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9685',
    'Terreno em Centro',
    'Ref: 9685. Proprietário: Luiz. Telefone:  +5521999836481',
    'terreno',
    'venda',
    13000000,
    0,
    0,
    0,
    85000,
    '00, 00',
    'Centro',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3293',
    'Terreno em Centro',
    'Ref: 3293. Proprietário: Bispo Eduardo K1A. Telefone:  +5521970195980',
    'terreno',
    'venda',
    28000000,
    0,
    0,
    0,
    97000,
    'Rodovia Rio-Santos, km 434, Mangaratiba, RJ, 9',
    'Centro',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1045',
    'Cobertura em Centro',
    'Ref: 1045. Proprietário: Sara Lima Adm Apt Porto Real. Telefone:  +351914514701',
    'cobertura',
    'aluguel',
    850000,
    3,
    3,
    2,
    97000,
    '00, 00',
    'Centro',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ120525',
    'Casa em Centro',
    'Ref: LC-LBZ120525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    7,
    9,
    2,
    400,
    'Rua Cesar Augusto São Luís, 164',
    'Centro',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA300621',
    'Casa em Centro',
    'Ref: LC-LA300621. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2500000,
    4,
    5,
    2,
    800,
    'sem nome 444, 888',
    'Centro',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0305212',
    'Hotel em Centro',
    'Ref: LC-LA0305212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5500000,
    18,
    20,
    13,
    1500,
    'sem nome, 556',
    'Centro',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LBZ231123',
    'Casa de Condomínio em Rasa',
    'Ref: LBZ231123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1650000,
    3,
    3,
    2,
    750,
    'Av. José Bento Ribeiro Dantas, 456',
    'Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA151122',
    'Casa de Condomínio em Rasa',
    'Ref: LC-LA151122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2500000,
    5,
    4,
    2,
    97000,
    'SEM NOME, 4561',
    'Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA190822',
    'Casa em Rasa',
    'Ref: LC-LA190822. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    8,
    9,
    4,
    37000,
    'SEM NOME, 111',
    'Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA160821',
    'Casa em Rasa',
    'Ref: LC-LA160821. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6000000,
    6,
    7,
    6,
    3170,
    'sem nome, 1212',
    'Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ231223',
    'Casa de Condomínio em Rasa',
    'Ref: LC-LBZ231223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1200000,
    3,
    3,
    1,
    300,
    'A, 111',
    'Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5963',
    'Casa de Condomínio em Centro',
    'Ref: 5963. Proprietário: Ale Paraty. Telefone:  +5513974220359',
    'casa',
    'venda',
    2700000,
    2,
    3,
    0,
    97000,
    '12, 07',
    'Centro',
    'Paraty',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '30745',
    'Casa em Enseada',
    'Ref: 30745. Proprietário: CARLOS PROPRIETARIO CLARICE. Telefone:  +5524999272775',
    'casa',
    'venda',
    1800000,
    5,
    6,
    3,
    97000,
    'Rua Professor Orlando de Meirelles, 10',
    'Enseada',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3246',
    'Casa em Enseada',
    'Ref: 3246. Proprietário: Jana. Telefone:  +5521976497249',
    'casa',
    'venda',
    3680000,
    8,
    10,
    6,
    554.97,
    'Estrada Vereador Benedito Adelino, 0000',
    'Enseada',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7410',
    'Ponto Comercial em Balneário',
    'Ref: 7410. Proprietário: Mikeias. Telefone:  +5524988159641',
    'comercial',
    'venda',
    2000000,
    7,
    3,
    3,
    348,
    'Rua José Elias Rabha, s/n',
    'Balneário',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6753',
    'Apartamento em Parque das Palmeiras',
    'Ref: 6753. Proprietário: carem. Telefone:  +5524999939995',
    'apartamento',
    'aluguel',
    650000,
    3,
    1,
    1,
    99.09,
    'Rua José Belmiro da Paixão, 230',
    'Parque das Palmeiras',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3232',
    'Casa de Condomínio em Marinas',
    'Ref: 3232. Proprietário: Alexandre Ticom Praia Do Cafe. Telefone:  +5521984541111',
    'casa',
    'venda',
    0,
    4,
    3,
    0,
    190,
    'Estrada do Marinas, 0000',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1451',
    'Cobertura em Marinas',
    'Ref: 1451. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'cobertura',
    'venda',
    2100000,
    4,
    5,
    2,
    402.4,
    'Estrada do Marinas, ',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3449',
    'Casa em Marinas',
    'Ref: 3449. Proprietário: SJG INDÚSTRIA METALURGICA LTDA. Telefone:  +5521999212143',
    'casa',
    'venda',
    1999990,
    4,
    4,
    3,
    402.4,
    'Estrada do Marinas, 111',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8620',
    'Casa de Condomínio em Marinas',
    'Ref: 8620. Proprietário: Norma ótica. Telefone:  +5524999391728',
    'casa',
    'venda',
    1700000,
    5,
    6,
    2,
    402.4,
    'Estrada do Marinas, 1700',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8835',
    'Casa em Marinas',
    'Ref: 8835. Proprietário: Carla Guimarães. Telefone:  +5524992527830',
    'casa',
    'venda',
    5700000,
    4,
    3,
    8,
    402.4,
    'Estrada do Marinas, 00000',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2233',
    'Terreno em Marinas',
    'Ref: 2233. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'terreno',
    'aluguel',
    50000000,
    0,
    0,
    0,
    13400,
    'Estrada do Marinas, 110',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5014',
    'Apartamento em Marinas',
    'Ref: 5014. Proprietário: Marcelo proprietário verde mares 4. Telefone:  +5524993291000',
    'apartamento',
    'venda',
    970000,
    3,
    3,
    2,
    180,
    'Estrada do Marinas, ',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '94140',
    'Casa de Condomínio em Marinas',
    'Ref: 94140. Proprietário: André casa marinas 94140. Telefone:  +5521996486777',
    'casa',
    'venda',
    2380000,
    4,
    4,
    4,
    13400,
    'Estrada do Marinas, 1700',
    'Marinas',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8710',
    'Casa de Condomínio em Colégio Naval',
    'Ref: 8710. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    35000000,
    11,
    13,
    3,
    5000,
    'Estrada Vereador Benedito Adelino, Tanguá, 00001',
    'Colégio Naval',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6771',
    'Casa em Colégio Naval',
    'Ref: 6771. Proprietário: henrique dono casa vila velha 9mi. Telefone:  +5521999712166',
    'casa',
    'venda',
    13000000,
    9,
    11,
    6,
    5898,
    'Avenida Marquês de Leão, 00000',
    'Colégio Naval',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7750',
    'Casa de Condomínio em Colégio Naval',
    'Ref: 7750. Proprietário: Valpini Casa 2. Telefone:  +5521988153131',
    'casa',
    'venda',
    15000000,
    5,
    6,
    3,
    5898,
    'Estrada Vereador Benedito Adelino, Tanguá, 00001',
    'Colégio Naval',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8945',
    'Terreno em Bonfim',
    'Ref: 8945. Proprietário: Marli Terreno Jamanta. Telefone:  +16095257432',
    'terreno',
    'venda',
    450000,
    0,
    0,
    0,
    498,
    'Rua Jorge Salomão, ',
    'Bonfim',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9995',
    'Casa em Praia Grande',
    'Ref: 9995. Proprietário: agnaldo caseiro casa praia grande. Telefone:  +5524999110336',
    'casa',
    'venda',
    11500000,
    7,
    8,
    6,
    498,
    'Avenida Marquês de Leão, 1273',
    'Praia Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2602',
    'Casa em Praia Grande',
    'Ref: 2602. Proprietário: Julio Magalhaes. Telefone:  +5521999355599',
    'casa',
    'venda',
    15000000,
    6,
    7,
    7,
    498,
    'Praia Grande, 044',
    'Praia Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8182',
    'Casa em Praia Grande',
    'Ref: 8182. Proprietário: Claudio Casa Praia grande. Telefone:  +5521995332172',
    'casa',
    'venda',
    6500000,
    8,
    9,
    4,
    498,
    'Praia Grande, 8',
    'Praia Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2727',
    'Casa em Vila Velha',
    'Ref: 2727. Proprietário: Jéssica Fernandes. Telefone:  +5521964580806',
    'casa',
    'venda',
    19999900,
    8,
    10,
    6,
    21657,
    'Estrada Vereador Benedito Adelino, 4159',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1717',
    'Casa em Vila Velha',
    'Ref: 1717. Proprietário: matheus caseiro vila velha casa 20mi. Telefone:  +5524999572907',
    'casa',
    'venda',
    19999990,
    6,
    8,
    8,
    21657,
    'Avenida Vereador Benedito Adelino, ',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2008',
    'Terreno em Vila Velha',
    'Ref: 2008. Proprietário: proprietaria terreno praia da figueira. Telefone:  +5524998498763',
    'terreno',
    'venda',
    8000000,
    0,
    0,
    0,
    4570,
    'Estrada Vereador Benedito Adelino, 6000',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7435',
    'Casa de Condomínio em Vila Velha',
    'Ref: 7435. Proprietário: Lgomes Gomes Vila Velha. village. Telefone:  +5527992990044',
    'casa',
    'venda',
    1600000,
    5,
    6,
    3,
    4570,
    'Estrada Vereador Benedito Adelino, 3709',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6825',
    'Casa de Condomínio em Vila Velha',
    'Ref: 6825. Proprietário: sergio farol de angra. Telefone:  +5521972133933',
    'casa',
    'venda',
    5000000,
    6,
    8,
    3,
    4570,
    'Estrada Vereador Benedito Adelino, 00000',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2692',
    'Casa de Condomínio em Vila Velha',
    'Ref: 2692. Proprietário: Ricardo Gomes Caseiro Ponta Do Comtador. Telefone:  +5524988710374',
    'casa',
    'venda',
    3500000,
    5,
    6,
    2,
    183,
    'Estrada Vereador Benedito Adelino, 00000',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7172',
    'Casa em Vila Velha',
    'Ref: 7172. Proprietário: tiago pousada mestre augusto. Telefone:  +5524999919955',
    'casa',
    'venda',
    5999990,
    10,
    10,
    5,
    1567,
    'Estrada Vereador Benedito Adelino, 4509',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2851',
    'Casa de Condomínio em Vila Velha',
    'Ref: 2851. Proprietário: Monica Proprietaria casa Praia do Leste. Telefone:  +5521988992313',
    'casa',
    'venda',
    6000000,
    5,
    6,
    5,
    1567,
    'Estrada Vereador Benedito Adelino, 001',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9577',
    'Casa em Vila Velha',
    'Ref: 9577. Proprietário: Silmara Ruman. Telefone:  +5511999926262',
    'casa',
    'venda',
    22000000,
    10,
    12,
    8,
    9000,
    'Estrada Vereador Benedito Adelino, 00',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3074',
    'Casa em Vila Velha',
    'Ref: 3074. Proprietário: ricardo caseiro casa calafate 10mi. Telefone:  +5521990697618',
    'casa',
    'venda',
    9999990,
    4,
    6,
    7,
    1000,
    'Estrada Vereador Benedito Adelino, ',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3827',
    'Casa em Vila Velha',
    'Ref: 3827. Proprietário: Sr. Murilo Casa Vila Velha Proprietario. Telefone:  +5521967465058',
    'casa',
    'venda',
    0,
    8,
    7,
    20,
    12000,
    'Praia Grande, 5009',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3309',
    'Casa em Vila Velha',
    'Ref: 3309. Proprietário: Beatriz Valim. Telefone:  +5511945022424',
    'casa',
    'venda',
    0,
    7,
    9,
    10,
    12000,
    'Estrada Vereador Benedito Adelino, 8',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3498',
    'Casa de Condomínio em Vila Velha',
    'Ref: 3498. Proprietário: Giorgio Casa , Ponta Do Cantador VilaVelha. Telefone:  +5511994653776',
    'casa',
    'venda',
    3000000,
    6,
    5,
    2,
    700,
    'Estrada Vereador Benedito Adelino, 00000',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3080',
    'Casa em Vila Velha',
    'Ref: 3080. Proprietário: Miguel Proprietario Casa Vila Velha. Telefone:  +5521999882252',
    'casa',
    'venda',
    14999900,
    5,
    8,
    3,
    4350,
    'Estrada Vereador Benedito Adelino, 3709',
    'Vila Velha',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7700',
    'Casa de Condomínio em Tanguá',
    'Ref: 7700. Proprietário: Raquel proprietaria tangua 18. Telefone:  +5561996038777',
    'casa',
    'venda',
    6300000,
    5,
    7,
    3,
    4350,
    'Estrada Vereador Benedito Adelino, Tanguá, 00001',
    'Tanguá',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5973',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 5973. Proprietário: Antônio casa amarela. Telefone:  +5524998779340',
    'casa',
    'venda',
    10000000,
    10,
    10,
    0,
    709.46,
    'Estrada Vereador Benedito Adelino, 18',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8070',
    'Casa de Condomínio em Retiro (Cunhambebe)',
    'Ref: 8070. Proprietário: Milton Proprietario Casa Ponta Do Sape. Telefone:  +5521971780401',
    'casa',
    'venda',
    6000000,
    9,
    11,
    5,
    450,
    'Estrada Vereador Benedito Adelino, 0000',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9424',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 9424. Proprietário: elisangela cadastrar!. Telefone:  +5524999959993',
    'casa',
    'venda',
    3999999.99,
    5,
    6,
    4,
    450,
    'Estrada Ponta do Sape, 00',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4876',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 4876. Proprietário: Ricardo casa Retiro. Telefone:  +5531985116583',
    'casa',
    'venda',
    20000000,
    7,
    8,
    4,
    2330,
    'Estrada Vereador Benedito Adelino, 0000',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9379',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 9379. Proprietário: erick proprietario casa retiro. Telefone:  +5524988524151',
    'casa',
    'venda',
    4800000,
    4,
    5,
    6,
    2330,
    'Avenida Vereador Benedito Adelino, 120',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4949',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 4949. Proprietário: Aline secretaria proprietario casa retiro. Telefone:  +5518997126859',
    'casa',
    'venda',
    3500000,
    4,
    5,
    8,
    3000,
    'Avenida Vereador Benedito Adelino, 130',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6396',
    'Casa de Condomínio em Retiro (Cunhambebe)',
    'Ref: 6396. Proprietário: Rodrigo Fahham. Telefone:  +5521981411401',
    'casa',
    'venda',
    2100000,
    4,
    5,
    2,
    3000,
    'Estrada Vereador Benedito Adelino, 18',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9567',
    'Casa de Condomínio em Retiro (Cunhambebe)',
    'Ref: 9567. Proprietário: Ricardo. Telefone:  +5524993152784',
    'casa',
    'venda',
    3100000,
    5,
    6,
    0,
    280,
    'Estrada Vereador Benedito Adelino, 18',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8911',
    'Casa em Retiro (Cunhambebe)',
    'Ref: 8911. Proprietário: Humberto proprietario casa retiro 5.5mi. Telefone:  +5521993553219',
    'casa',
    'venda',
    5999990,
    5,
    6,
    4,
    280,
    'Av. Vereador Benedito Adelino, 000000',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4787',
    'Casa de Condomínio em Retiro (Cunhambebe)',
    'Ref: 4787. Proprietário: Luiz Antônio casa verde Retiro. Telefone:  +5521999633017',
    'casa',
    'venda',
    1950000,
    3,
    3,
    2,
    280,
    'Estrada Vereador Benedito Adelino, 18',
    'Retiro (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '947',
    'Casa em Ponta do Sapê (Cunhambebe)',
    'Ref: 947. Proprietário: carem. Telefone:  +5524999939995',
    'casa',
    'venda',
    95000000,
    9,
    10,
    0,
    299500,
    'Ilha Pitanguí, 000',
    'Ponta do Sapê (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7420',
    'Casa em Ponta do Sapê (Cunhambebe)',
    'Ref: 7420. Proprietário: Conrado. Telefone:  +5521997411949',
    'casa',
    'venda',
    0,
    5,
    6,
    9,
    299500,
    'Rua Dibiase, 0000',
    'Ponta do Sapê (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2472',
    'Casa em Ponta do Sapê (Cunhambebe)',
    'Ref: 2472. Proprietário: Conrado. Telefone:  +5521997411949',
    'casa',
    'venda',
    0,
    4,
    5,
    2,
    299500,
    'Rua Dibiase, 0000',
    'Ponta do Sapê (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3810',
    'Casa em Frade (Cunhambebe)',
    'Ref: 3810. Proprietário: abilio pedra casa ilha caieira proprietario. Telefone:  +5524988696195',
    'casa',
    'venda',
    5000000,
    5,
    6,
    0,
    20000,
    'ILHA DA CAIEIRA, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1637',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1637. Proprietário: Fernando Campário H26 Frade. Telefone:  +5521993110756',
    'casa',
    'venda',
    4500000,
    5,
    1,
    3,
    209,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4556',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4556. Proprietário: Marcos castilho responsável casa frade. Telefone:  +5524999690718',
    'casa',
    'venda',
    17000000,
    5,
    6,
    4,
    320,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4747',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4747. Proprietário: Pedro Maringa. Telefone:  +5511982441681',
    'casa',
    'venda',
    4500000,
    5,
    5,
    6,
    320,
    'Condomínio Porto do Frade, 39',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2170',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 2170. Proprietário: Paulo Casa 12 Rua Do Lago Temporada. Telefone:  +5521992380660',
    'casa',
    'aluguel',
    0,
    4,
    4,
    3,
    320,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4062',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4062. Proprietário: Fernando Lufft Casa Ilha Capivarí. Telefone:  +5511995739256',
    'casa',
    'venda',
    60000000,
    7,
    7,
    3,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2832',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 2832. Proprietário: Leldo. Telefone:  +5521998569630',
    'casa',
    'venda',
    3950000,
    6,
    8,
    2,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3635',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3635. Proprietário: odila proprietaria casa frade. Telefone:  +5521999753175',
    'casa',
    'venda',
    7500000,
    6,
    8,
    3,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4366',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4366. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    15000000,
    5,
    6,
    5,
    1200,
    'Condomínio Porto do Frade, 1',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3763',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3763. Proprietário: Suelen Adm Da Casa Frade Rachid. Telefone:  +5511982023789',
    'casa',
    'venda',
    8500000,
    5,
    6,
    3,
    483.57,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1820',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1820. Proprietário: marco antonio casa frade com lancha. Telefone:  +5521999826625',
    'casa',
    'venda',
    10000000,
    6,
    7,
    4,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1834',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1834. Proprietário: Ramon casa Green. Telefone:  +5524974027075',
    'casa',
    'venda',
    21000000,
    12,
    9,
    0,
    1200,
    'Condomínio Frade Green, 0000',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7758',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 7758. Proprietário: Augusto/ Dito. Telefone:  +5511996101111',
    'casa',
    'venda',
    70000000,
    9,
    10,
    10,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2159',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 2159. Proprietário: zé administrador casa frade h70. Telefone:  +5524992903573',
    'casa',
    'venda',
    18000000,
    3,
    4,
    0,
    1200,
    'Condomínio Porto do Frade, 45',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8134',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 8134. Proprietário: Ana proprietária Casa frade canal. Telefone:  +5521996241906',
    'casa',
    'venda',
    4500000,
    3,
    3,
    1,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7499',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 7499. Proprietário: Vera Casa costeira Frade. Telefone:  +5521993532153',
    'casa',
    'venda',
    16000000,
    5,
    6,
    3,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1017',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1017. Proprietário: geisy proprietario casa teleferico portogalo. Telefone:  +5524998659627',
    'casa',
    'venda',
    19000000,
    10,
    11,
    7,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2136',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 2136. Proprietário: geisy proprietario casa teleferico portogalo. Telefone:  +5524998659627',
    'casa',
    'venda',
    14000000,
    7,
    9,
    1,
    1190,
    'Condomínio Frade Green, 0000',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9559',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 9559. Proprietário: Phelipe matias proprietario casa frade moringa velha 03. Telefone:  +5561981175757',
    'casa',
    'venda',
    4500000,
    8,
    10,
    4,
    1200,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8732',
    'Casa em Frade (Cunhambebe)',
    'Ref: 8732. Proprietário: Georgia Buffara. Telefone:  +5521981190003',
    'casa',
    'venda',
    0,
    4,
    5,
    0,
    1200,
    'Pr Grande do Frade, SN, 8',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3784',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3784. Proprietário: Alexandro Casa Frade. Telefone:  +5524999870648',
    'casa',
    'venda',
    5000000,
    5,
    4,
    0,
    303.72,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9383',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 9383. Proprietário: Branco Adm. Telefone:  +5524999642803',
    'casa',
    'venda',
    14000000,
    10,
    10,
    5,
    606.8,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1544',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1544. Proprietário: guto propr. casa frade 4,5mi. Telefone:  +5521997694192',
    'casa',
    'venda',
    4500000,
    4,
    3,
    3,
    606.8,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1198',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1198. Proprietário: ADELAIDE VIDAL. Telefone:  +5521988410218',
    'casa',
    'venda',
    0,
    4,
    4,
    2,
    606.8,
    'Condomínio Porto do Frade, 00',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '077',
    'Casa em Frade (Cunhambebe)',
    'Ref: 077. Proprietário: Bruno Gonçalves administrador. Telefone:  +5511965862974',
    'casa',
    'venda',
    50000000,
    5,
    7,
    0,
    25000,
    'ILHA DO JAPÃO, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5400',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 5400. Proprietário: Lityeri. Telefone:  +5521996932221',
    'casa',
    'venda',
    20000000,
    5,
    6,
    4,
    1018,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5225',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 5225. Proprietário: Hélio Germana guinle. Telefone:  +5521999813184',
    'casa',
    'venda',
    3000000,
    4,
    4,
    2,
    1018,
    'Condomínio Porto do Frade, 00',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3030',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3030. Proprietário: proprietária Tina. Telefone:  +5511999857927',
    'casa',
    'venda',
    17000000,
    5,
    7,
    3,
    1018,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4367',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4367. Proprietário: Claudio Prop. Casa Germana 1M. Telefone:  +5521971668846',
    'casa',
    'venda',
    3500000,
    5,
    6,
    1,
    1018,
    'Condomínio Porto do Frade, 00',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8480',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 8480. Proprietário: Claudio Prop. Casa Germana 1M. Telefone:  +5521971668846',
    'casa',
    'venda',
    0,
    3,
    4,
    2,
    1018,
    'Condomínio Porto do Frade, 00',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3148',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3148. Proprietário: Guilherme Condomínio Morada Do Canal Casa 5. Telefone:  +5531995894940',
    'casa',
    'venda',
    5000000,
    5,
    6,
    2,
    1018,
    'Condomínio Porto do Frade, 5',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1690',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 1690. Proprietário: Antonio proprietário casa Germana 4M. Telefone:  +5512996175500',
    'casa',
    'venda',
    4500000,
    4,
    6,
    0,
    1018,
    'Condomínio Porto do Frade, 00',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3973',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 3973. Proprietário: Sabrina Frade Corretora. Telefone:  +5524999816419',
    'casa',
    'venda',
    0,
    6,
    7,
    4,
    1018,
    'Condomínio Frade Green, 0000',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2867',
    'Terreno em Frade (Cunhambebe)',
    'Ref: 2867. Proprietário: leandro responsavel condominio. Telefone:  +5524999408468',
    'terreno',
    'venda',
    3999999,
    0,
    0,
    0,
    850,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6222',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 6222. Proprietário: patricia proprietaria village do porto frade leilao. Telefone:  +5511999372629',
    'casa',
    'venda',
    4500000,
    6,
    6,
    2,
    850,
    'Condomínio Porto do Frade, 39',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1483',
    'Casa em Frade (Cunhambebe)',
    'Ref: 1483. Proprietário: Fabio britto. Telefone:  +5521998734222',
    'casa',
    'venda',
    4500000,
    4,
    4,
    0,
    390,
    'Porto Prime, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2267',
    'Casa em Frade (Cunhambebe)',
    'Ref: 2267. Proprietário: José Roberto. Telefone:  +5524992207373',
    'casa',
    'venda',
    0,
    7,
    8,
    4,
    500,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4218',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4218. Proprietário: Branco Adm. Telefone:  +5524999642803',
    'casa',
    'venda',
    0,
    8,
    9,
    5,
    500,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '70155',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 70155. Proprietário: Henrique. Telefone:  +5521996301513',
    'casa',
    'venda',
    0,
    6,
    6,
    3,
    500,
    'Condomínio Porto do Frade, 39',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7038',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 7038. Proprietário: Marcos Gaves proprietário casa 7. Telefone:  +5511991662447',
    'casa',
    'venda',
    4000000,
    5,
    6,
    3,
    500,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4743',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4743. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    0,
    7,
    8,
    0,
    500,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2582',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 2582. Proprietário: Ademir Proprietário. Telefone:  +5511995575225',
    'casa',
    'venda',
    5800000,
    6,
    6,
    0,
    500,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8371',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 8371. Proprietário: Simone Administradora. Telefone:  +5511999666088',
    'casa',
    'venda',
    6500000,
    7,
    10,
    0,
    848,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7837',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 7837. Proprietário: José Roberto. Telefone:  +5524992207373',
    'casa',
    'aluguel',
    3000000,
    4,
    5,
    2,
    400,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4784',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 4784. Proprietário: Alexandro Casa Frade. Telefone:  +5524999870648',
    'casa',
    'venda',
    5000000,
    5,
    4,
    0,
    291.44,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6030',
    'Casa de Condomínio em Frade (Cunhambebe)',
    'Ref: 6030. Proprietário: Alexandro Casa Frade. Telefone:  +5524999870648',
    'casa',
    'venda',
    5000000,
    5,
    3,
    0,
    311.85,
    'Condomínio Porto do Frade, ',
    'Frade (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7088',
    'Casa em Piraquara (Cunhambebe)',
    'Ref: 7088. Proprietário: douglas dono pousada piraquara. Telefone:  +5524999171347',
    'casa',
    'venda',
    16500000,
    14,
    14,
    10,
    1200,
    'Rodovia Procurador Haroldo Fernandes Duarte, 00',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8988',
    'Terreno em Piraquara (Cunhambebe)',
    'Ref: 8988. Proprietário: Gabriel Oeaia. Telefone:  +5511989624437',
    'terreno',
    'venda',
    17000000,
    0,
    0,
    0,
    60000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 00003',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7096',
    'Casa em Piraquara (Cunhambebe)',
    'Ref: 7096. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    110000000,
    7,
    7,
    3,
    1800,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3798',
    'Casa em Piraquara (Cunhambebe)',
    'Ref: 3798. Proprietário: Rafael Valderez (filho). Telefone:  +5511991234109',
    'casa',
    'venda',
    24000000,
    5,
    6,
    5,
    1000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1236',
    'Casa em Piraquara (Cunhambebe)',
    'Ref: 1236. Proprietário: Rafael Valderez (filho). Telefone:  +5511991234109',
    'casa',
    'venda',
    27000000,
    6,
    5,
    3,
    5000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9097',
    'Terreno em Piraquara (Cunhambebe)',
    'Ref: 9097. Proprietário: proprietária Tina. Telefone:  +5511999857927',
    'terreno',
    'venda',
    25000000,
    0,
    0,
    0,
    35000,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Piraquara (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3064',
    'Casa de Condomínio em Praia Vermelha (Mambucaba)',
    'Ref: 3064. Proprietário: Eduardo casa 22. Telefone:  +5524999847038',
    'casa',
    'venda',
    7800000,
    7,
    6,
    4,
    4000,
    'Condomínio Quinta das Palmeiras, 0000',
    'Praia Vermelha (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6455',
    'Terreno em Praia das Goiabas (Mambucaba)',
    'Ref: 6455. Proprietário: Neuci Latrechia. Telefone:  +5511986882302',
    'terreno',
    'venda',
    4000000,
    0,
    0,
    0,
    16300,
    'Condomínio Praia das Goiabas, 0000',
    'Praia das Goiabas (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2059',
    'Casa de Condomínio em Praia das Goiabas (Mambucaba)',
    'Ref: 2059. Proprietário: Neuci Latrechia. Telefone:  +5511986882302',
    'casa',
    'venda',
    0,
    4,
    5,
    0,
    16300,
    'Condomínio Praia das Goiabas, 0000',
    'Praia das Goiabas (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6588',
    'Terreno em Vila Histórica de Mambucaba (Mambucaba)',
    'Ref: 6588. Proprietário: SJG INDÚSTRIA METALURGICA LTDA. Telefone:  +5521999212143',
    'terreno',
    'venda',
    7990000,
    0,
    0,
    0,
    37550,
    'Rua das Flores, 39',
    'Vila Histórica de Mambucaba (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6589',
    'Terreno em Vila Histórica de Mambucaba (Mambucaba)',
    'Ref: 6589. Proprietário: SJG INDÚSTRIA METALURGICA LTDA. Telefone:  +5521999212143',
    'terreno',
    'venda',
    4500000,
    0,
    0,
    0,
    18000,
    'Rua das Flores, 38',
    'Vila Histórica de Mambucaba (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2274',
    'Casa em Vila Histórica de Mambucaba (Mambucaba)',
    'Ref: 2274. Proprietário: Ramon tatolandia ilha araçatiba. Telefone:  +5511987492595',
    'casa',
    'venda',
    28000000,
    7,
    9,
    0,
    900,
    'vila historica, 00000',
    'Vila Histórica de Mambucaba (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5960',
    'Apartamento em Parque Mambucaba (Mambucaba)',
    'Ref: 5960. Proprietário: Sergio proprietario sitio do bosque. Telefone:  +5511982919968',
    'apartamento',
    'venda',
    1350000,
    2,
    2,
    2,
    60000,
    'Rod. BR-101 km533, 533',
    'Parque Mambucaba (Mambucaba)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2188',
    'Terreno em Bracuí (Cunhambebe)',
    'Ref: 2188. Proprietário: DIOGO ROCHA. Telefone:  +5524992355122',
    'terreno',
    'venda',
    1000000,
    0,
    0,
    0,
    1701,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7537',
    'Apartamento em Bracuí (Cunhambebe)',
    'Ref: 7537. Proprietário: Sjanira. Telefone:  +5521969578040',
    'apartamento',
    'venda',
    799999,
    4,
    2,
    2,
    1701,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7789',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 7789. Proprietário: carolina gardon porto bracuhy parceria. Telefone:  +5521998786389',
    'casa',
    'venda',
    19999000,
    5,
    6,
    4,
    1701,
    'RESERVA DAS AROEIRAS, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1315',
    'Casa em Bracuí (Cunhambebe)',
    'Ref: 1315. Proprietário: thiago proprietario serra e mar e ilha. Telefone:  +5521970248774',
    'casa',
    'venda',
    4000000,
    5,
    4,
    0,
    25037,
    'ILHA COMPRIDA, 000',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4688',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 4688. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    55000000,
    8,
    9,
    6,
    0.2,
    'RESERVA DAS AROEIRAS, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7122',
    'Apartamento em Bracuí (Cunhambebe)',
    'Ref: 7122. Proprietário: Fernanda Lima. Telefone:  +5524999959992',
    'apartamento',
    'aluguel',
    590000,
    1,
    1,
    1,
    0.2,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9831',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 9831. Proprietário: Paulo proprietário casa bracuy. Telefone:  +5524999973678',
    'casa',
    'venda',
    6500000,
    5,
    7,
    3,
    1239.25,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5248',
    'Casa em Bracuí (Cunhambebe)',
    'Ref: 5248. Proprietário: Fernando Proprietario Casa Ilha Do Jorge. Telefone:  +5521997671029',
    'casa',
    'venda',
    3500000,
    4,
    5,
    3,
    360.99,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1377',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 1377. Proprietário: rogerio maia proprietario ilha do jorge casa 20mi. Telefone:  +5521998053003',
    'casa',
    'venda',
    12000000,
    6,
    7,
    6,
    2494.21,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5121',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 5121. Proprietário: Rogério Casa aroeiras. Telefone:  +5519974080034',
    'casa',
    'venda',
    0,
    5,
    6,
    4,
    2494.21,
    'RESERVA DAS AROEIRAS, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8530',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 8530. Proprietário: Ricardo. Telefone:  +5524998450032',
    'casa',
    'venda',
    5100000,
    6,
    7,
    5,
    1006.99,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4656',
    'Terreno em Bracuí (Cunhambebe)',
    'Ref: 4656. Proprietário: Sidao caieirinha. Telefone:  +5521999823336',
    'terreno',
    'venda',
    2500000,
    0,
    0,
    0,
    1420,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'M-B16',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: M-B16. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    25000000,
    10,
    10,
    4,
    1650,
    'RESERVA DAS AROEIRAS, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2816',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 2816. Proprietário: Eduardo proprietário. Telefone:  +5521998569491',
    'casa',
    'venda',
    7500000,
    6,
    7,
    3,
    1650,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2262',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 2262. Proprietário: Teca proprietária. Telefone:  +5524998177808',
    'casa',
    'aluguel',
    2100000,
    4,
    5,
    3,
    748.47,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2391',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 2391. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    18900000,
    6,
    7,
    2,
    970,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9719',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 9719. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    0,
    5,
    7,
    0,
    1020,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2800',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 2800. Proprietário: Dani Mar Proprietário. Telefone:  +5524988650636',
    'casa',
    'venda',
    0,
    4,
    2,
    6,
    1500,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9057',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 9057. Proprietário: Aloisio. Telefone:  +5511999386980',
    'casa',
    'venda',
    3500000,
    6,
    5,
    3,
    1500,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6945',
    'Casa em Bracuí (Cunhambebe)',
    'Ref: 6945. Proprietário: Cristina Machado. Telefone:  +5511999885454',
    'casa',
    'venda',
    0,
    6,
    8,
    6,
    1500,
    'Beco da Tainha, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2273',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 2273. Proprietário: Cristina Machado. Telefone:  +5511999885454',
    'casa',
    'venda',
    0,
    6,
    8,
    6,
    1500,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '77975',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 77975. Proprietário: Sr. Valter. Telefone:  +5524981180256',
    'casa',
    'venda',
    6500000,
    4,
    4,
    5,
    1096,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8960',
    'Casa de Condomínio em Bracuí (Cunhambebe)',
    'Ref: 8960. Proprietário: Sr Fernando Casa Bracuhy. Telefone:  +5521995953027',
    'casa',
    'venda',
    44000000,
    10,
    10,
    4,
    2800,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'DUP-9440',
    'Terreno em Bracuí (Cunhambebe)',
    'Ref: DUP-9440. Proprietário: Inácio Naná. Telefone:  +5521999860018',
    'terreno',
    'venda',
    7000000,
    0,
    0,
    0,
    5680,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Bracuí (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3814',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 3814. Proprietário: Dário proprietário. Telefone:  +5524999875994',
    'casa',
    'venda',
    2999990,
    7,
    9,
    3,
    5680,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8656',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 8656. Proprietário: sergio casa amarela cielo. Telefone:  +5521999850480',
    'casa',
    'venda',
    5800000,
    5,
    7,
    2,
    5680,
    'Avenida do Canto, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6599',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 6599. Proprietário: valdeci responsavel marbella casas. Telefone:  +5524992021695',
    'casa',
    'venda',
    3000000,
    5,
    7,
    3,
    5680,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8733',
    'Cobertura em Pontal (Cunhambebe)',
    'Ref: 8733. Proprietário: isa pier 103 proprietaria. Telefone:  +447400088477',
    'cobertura',
    'venda',
    999000,
    4,
    3,
    2,
    5680,
    'Rodovia Procurador Haroldo Fernandes Duarte, 00',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9987',
    'Cobertura em Pontal (Cunhambebe)',
    'Ref: 9987. Proprietário: camila proprietaria pier103 reformado. Telefone:  +5521997301168',
    'cobertura',
    'venda',
    1350000,
    4,
    3,
    2,
    5680,
    'Rodovia Procurador Haroldo Fernandes Duarte, 00',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1097',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 1097. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    3200000,
    4,
    5,
    2,
    5680,
    'Ponta da Cruz, 11',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2083',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 2083. Proprietário: João Miller. Telefone:  +5521988998507',
    'casa',
    'venda',
    0,
    4,
    5,
    2,
    5680,
    'Rua Ponta dos Ubas, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9095',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 9095. Proprietário: J R Fernando Salomão. Telefone:  +5521985588938',
    'casa',
    'venda',
    2700000,
    4,
    5,
    5,
    294.99,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8269',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 8269. Proprietário: Patrícia Paradiso casa 03. Telefone:  +5521998880276',
    'casa',
    'venda',
    6800000,
    7,
    0,
    0,
    373.62,
    'Avenida do Canto, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2996',
    'Casa em Pontal (Cunhambebe)',
    'Ref: 2996. Proprietário: Sônia. Telefone:  +5511982752828',
    'casa',
    'venda',
    2999990,
    4,
    2,
    2,
    373.62,
    'Ponta da Cruz, 11',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9944',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 9944. Proprietário: Frederico Casa 62 Marbella. Telefone:  +5524992587656',
    'casa',
    'venda',
    2000000,
    4,
    4,
    2,
    373.62,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6808',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 6808. Proprietário: Beth Proprietaria Da Casa Do Maui. Telefone:  +5521964151127',
    'casa',
    'venda',
    3500000,
    4,
    5,
    2,
    373.62,
    'Ponta da Cruz, 11',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '30743',
    'Terreno em Pontal (Cunhambebe)',
    'Ref: 30743. Proprietário: paulo nestor. Telefone:  +5521991052145',
    'terreno',
    'venda',
    5999990,
    0,
    0,
    0,
    21671,
    'Avenida do Canto, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '18027',
    'Terreno em Pontal (Cunhambebe)',
    'Ref: 18027. Proprietário: andre proprietario terreno serra e mar. Telefone:  +5524988438514',
    'terreno',
    'venda',
    399990,
    0,
    0,
    0,
    500,
    'Alameda dos Colibris, 1',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '89547',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 89547. Proprietário: André Moraes Proprietário. Telefone:  +5521992309483',
    'casa',
    'venda',
    3499000,
    6,
    6,
    3,
    500,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '48896',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 48896. Proprietário: Eliana proprietária marbella. Telefone:  +5521983157888',
    'casa',
    'venda',
    1750000,
    5,
    6,
    3,
    500,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '11199',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 11199. Proprietário: valdeci responsavel marbella casas. Telefone:  +5524992021695',
    'casa',
    'venda',
    2800000,
    4,
    5,
    2,
    500,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9393',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 9393. Proprietário: emilia casa paradiso. Telefone:  +5521994812479',
    'casa',
    'aluguel',
    2300000,
    4,
    6,
    3,
    500,
    'Avenida do Canto, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5393',
    'Casa em Pontal (Cunhambebe)',
    'Ref: 5393. Proprietário: Marcelo proprietário verde mares 4. Telefone:  +5524993291000',
    'casa',
    'venda',
    970000,
    7,
    3,
    6,
    400,
    'Alameda das Andorinhas, 000',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4419',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 4419. Proprietário: romulo proprietario bracuhy. Telefone:  +5524974046162',
    'casa',
    'venda',
    3200000,
    5,
    7,
    3,
    450,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1281',
    'Terreno em Pontal (Cunhambebe)',
    'Ref: 1281. Proprietário: luiz henrique proprietario terreno cond canto do mar. Telefone:  +5521992609019',
    'terreno',
    'venda',
    400000,
    0,
    0,
    0,
    622,
    'Avenida do Canto, 00',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '60325',
    'Apartamento em Pontal (Cunhambebe)',
    'Ref: 60325. Proprietário: Rogério. Telefone:  +5524981012488',
    'apartamento',
    'venda',
    1100000,
    3,
    2,
    1,
    622,
    'Rodovia Procurador Haroldo Fernandes Duarte, A/n',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7013',
    'Terreno em Pontal (Cunhambebe)',
    'Ref: 7013. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'terreno',
    'venda',
    100000000,
    0,
    0,
    0,
    41.4,
    'Rua Ponta dos Ubas, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5707',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 5707. Proprietário: Catarina proprietaria marbella 50. Telefone:  +5511996341734',
    'casa',
    'venda',
    3500000,
    4,
    5,
    3,
    41.4,
    'Condomínio Marbella, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '39561',
    'Casa em Pontal (Cunhambebe)',
    'Ref: 39561. Proprietário: Sergio Frazao proprietario. Telefone:  +5521999734820',
    'casa',
    'venda',
    4000000,
    6,
    3,
    5,
    41.4,
    'Ponta dos Ubás, 01',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2601',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 2601. Proprietário: daniella Proprietaria Paradiso. Telefone:  +5521989922100',
    'casa',
    'venda',
    3800000,
    5,
    6,
    3,
    41.4,
    'Avenida do Canto, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9001',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 9001. Proprietário: Diego. Telefone:  +5524999385267',
    'casa',
    'venda',
    2829862.31,
    3,
    4,
    2,
    41.4,
    'Rodovia Procurador Haroldo Fernandes Duarte, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7545',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 7545. Proprietário: Marcos Baida Proprietario Siriu 130. Telefone:  +13053335033',
    'casa',
    'venda',
    40000000,
    7,
    8,
    10,
    5611,
    'Rua Angra Azul, 00',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6061',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 6061. Proprietário: Ramon tatolandia ilha araçatiba. Telefone:  +5511987492595',
    'casa',
    'venda',
    3250000,
    4,
    5,
    2,
    262.61,
    'Ponta da Cruz, 11',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5110',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 5110. Proprietário: Roberto Carlos Proprietario casa 10 paradiso. Telefone:  +5521976073944',
    'casa',
    'aluguel',
    3700000,
    5,
    6,
    4,
    5611,
    'Avenida do Canto, 20',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7780',
    'Cobertura em Pontal (Cunhambebe)',
    'Ref: 7780. Proprietário: Michael Magalhães. Telefone:  +5521971641783',
    'cobertura',
    'venda',
    1200000,
    4,
    3,
    0,
    5611,
    'Rodovia Procurador Haroldo Fernandes Duarte, A/n',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2359',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 2359. Proprietário: Andressa Quintanilha. Telefone:  +5521995274361',
    'casa',
    'venda',
    5000000,
    4,
    5,
    2,
    5611,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1977',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 1977. Proprietário: liliano. Telefone:  +5524999977717',
    'casa',
    'venda',
    1380000,
    3,
    3,
    2,
    5611,
    'Rua Ponta dos Ubas, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8967',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 8967. Proprietário: Wilker Campos. Telefone:  +5511940341414',
    'casa',
    'venda',
    3800000,
    4,
    5,
    3,
    5611,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4455',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 4455. Proprietário: Aviva. Telefone:  +5511992340451',
    'casa',
    'venda',
    5500000,
    5,
    7,
    3,
    5611,
    'Avenida do Canto, 000',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7402',
    'Casa em Pontal (Cunhambebe)',
    'Ref: 7402. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    18000000,
    5,
    2,
    0,
    1402,
    'Rua Angra Azul, 00',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7078',
    'Casa de Condomínio em Pontal (Cunhambebe)',
    'Ref: 7078. Proprietário: Viggo. Telefone:  +5521990905990',
    'casa',
    'venda',
    2300000,
    4,
    5,
    2,
    1402,
    'Ponta da Cruz, 11',
    'Pontal (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1575',
    'Casa em Pontal do Partido (Cunhambebe)',
    'Ref: 1575. Proprietário: Sergio Araujo proprietario. Telefone:  +5524999881111',
    'casa',
    'venda',
    20000000,
    7,
    2,
    0,
    36000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Pontal do Partido (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3320',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3320. Proprietário: fernando porto marisco. Telefone:  +5524999640260',
    'casa',
    'venda',
    4300000,
    7,
    8,
    3,
    36000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8768',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 8768. Proprietário: Wallace Dono Da Casa 12. Telefone:  +5521996129194',
    'casa',
    'venda',
    27500000,
    6,
    8,
    3,
    36000,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3120',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3120. Proprietário: Marcelo Lima Porto Marisco. Telefone:  +5524999662280',
    'casa',
    'venda',
    4900000,
    4,
    5,
    2,
    36000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3470',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3470. Proprietário: Aucio. Telefone:  +5521999768489',
    'casa',
    'venda',
    3500000,
    5,
    1,
    3,
    200,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9623',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 9623. Proprietário: ROSÂNGELA MAGALHÃES PINTO. Telefone:  +5521999827465',
    'casa',
    'venda',
    6300000,
    8,
    9,
    2,
    36000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1064',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 1064. Proprietário: Patrickcasa Condominio Praia Do Engelho 18 Silva. Telefone:  +5521978807308',
    'casa',
    'venda',
    1845000,
    4,
    5,
    0,
    166,
    'Rodovia Procurador Haroldo Fernandes Duarte, 500',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3633',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3633. Proprietário: mauro proprietario marisco 03. Telefone:  +5521999853321',
    'casa',
    'venda',
    5500000,
    6,
    7,
    3,
    166,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7699',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 7699. Proprietário: Sr. Hélio proprietário casa a temporada. Telefone:  +5521999869994',
    'casa',
    'venda',
    0,
    6,
    7,
    5,
    700,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6262',
    'Casa em Itanema (Cunhambebe)',
    'Ref: 6262. Proprietário: Sr.Wilson. Telefone:  +5521988359814',
    'casa',
    'venda',
    0,
    5,
    7,
    6,
    166,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3656',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3656. Proprietário: D. ANA LUCIA VIV Casa Caieirinha L. 3 e 4. Telefone:  +5521987027066',
    'casa',
    'venda',
    0,
    5,
    6,
    3,
    166,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5357',
    'Terreno em Itanema (Cunhambebe)',
    'Ref: 5357. Proprietário: Juliane Amante. Telefone:  +5524981175551',
    'terreno',
    'venda',
    5000000,
    0,
    0,
    0,
    2875,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3557',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3557. Proprietário: Grace Patroa Casa 32 Caieirinha. Telefone:  +5521988051324',
    'casa',
    'venda',
    22000000,
    8,
    9,
    8,
    540,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3764',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3764. Proprietário: Prop. Nilo. Telefone:  +5521999829899',
    'casa',
    'venda',
    0,
    8,
    9,
    3,
    6500,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3737',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3737. Proprietário: antonio frota proprietario caieirinha. Telefone:  +5521995286003',
    'casa',
    'venda',
    27000000,
    7,
    8,
    6,
    6500,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7277',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 7277. Proprietário: Marcia Casa Branca Caieirinha. Telefone:  +5524999447618',
    'casa',
    'venda',
    25000000,
    6,
    8,
    3,
    602.65,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7437',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 7437. Proprietário: Lidea proprietaria. Telefone:  +5521999714757',
    'casa',
    'venda',
    5300000,
    8,
    9,
    4,
    6500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 24',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7007',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 7007. Proprietário: Sidao caieirinha. Telefone:  +5521999823336',
    'casa',
    'venda',
    27000000,
    12,
    12,
    6,
    6500,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3003',
    'Casa de Condomínio em Itanema (Cunhambebe)',
    'Ref: 3003. Proprietário: Sidao caieirinha. Telefone:  +5521999823336',
    'casa',
    'venda',
    24000000,
    10,
    11,
    4,
    350,
    'Rod. Rio santos, 150',
    'Itanema (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '35442',
    'Terreno em Praia da Ribeira (Cunhambebe)',
    'Ref: 35442. Proprietário: Rico corretor parceria. Telefone:  +5521996507290',
    'terreno',
    'venda',
    6000000,
    0,
    0,
    0,
    42400,
    'Rua Ilha da Gipóia, 1',
    'Praia da Ribeira (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7721',
    'Casa em Praia da Ribeira (Cunhambebe)',
    'Ref: 7721. Proprietário: Louise Pimentel. Telefone:  +5541992909984',
    'casa',
    'venda',
    0,
    7,
    10,
    0,
    42400,
    'Rua Ilha Grande, 3',
    'Praia da Ribeira (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '30742',
    'Casa em Gambôa do Belém (Cunhambebe)',
    'Ref: 30742. Proprietário: william proprietario ponta dos ubas casa azul. Telefone:  +5521967680227',
    'casa',
    'venda',
    2999990,
    6,
    7,
    2,
    42400,
    'Ponta dos Ubás, 2',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '27218',
    'Casa em Gambôa do Belém (Cunhambebe)',
    'Ref: 27218. Proprietário: leandra. Telefone:  +5521981052058',
    'casa',
    'venda',
    0,
    4,
    3,
    2,
    42400,
    'Ponta dos Ubás, 05',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2608',
    'Casa de Condomínio em Gambôa do Belém (Cunhambebe)',
    'Ref: 2608. Proprietário: Francisco proprietario casa 15mi ponta da cruz. Telefone:  +5521999828381',
    'casa',
    'venda',
    15000000,
    5,
    5,
    4,
    10000,
    'Ponta da Cruz, lote 22',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5024',
    'Terreno em Gambôa do Belém (Cunhambebe)',
    'Ref: 5024. Proprietário: Fabio Lopes. Telefone:  +5521994776789',
    'terreno',
    'venda',
    8000000,
    0,
    0,
    0,
    12000,
    'Ponta da Cruz, 24',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8407',
    'Cobertura em Gambôa do Belém (Cunhambebe)',
    'Ref: 8407. Proprietário: Nadia 101. Telefone:  +5521972777959',
    'cobertura',
    'venda',
    1350000,
    4,
    4,
    2,
    12000,
    'Ponta dos Ubás, ',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2290',
    'Casa de Condomínio em Gambôa do Belém (Cunhambebe)',
    'Ref: 2290. Proprietário: Mário Chimoda. Telefone:  +5524988638380',
    'casa',
    'venda',
    1200000,
    4,
    3,
    2,
    140,
    'Ponta da Cruz, C4',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '26323',
    'Casa em Gambôa do Belém (Cunhambebe)',
    'Ref: 26323. Proprietário: Francisco caseiro. Telefone:  +5524999792552',
    'casa',
    'venda',
    0,
    5,
    6,
    4,
    12000,
    'Porto Caiera, 00000',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '30744',
    'Terreno em Gambôa do Belém (Cunhambebe)',
    'Ref: 30744. Proprietário: Soares dono terreno ponta dos ubas. Telefone:  +5524999764172',
    'terreno',
    'venda',
    3500000,
    0,
    0,
    0,
    5000,
    'Ponta dos Ubás, 1',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '87374',
    'Casa de Condomínio em Gambôa do Belém (Cunhambebe)',
    'Ref: 87374. Proprietário: ricardo proprietario casa praia do moleque de baixo. Telefone:  +5521964082596',
    'casa',
    'venda',
    1800000,
    3,
    4,
    2,
    5000,
    'Ponta da Cruz, C4',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4771',
    'Apartamento em Gambôa do Belém (Cunhambebe)',
    'Ref: 4771. Proprietário: Kauã Soares Casa Porto Marisco. Telefone:  +5524992574983',
    'apartamento',
    'venda',
    0,
    7,
    8,
    3,
    5000,
    'Ponta dos Ubás, 000',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2694',
    'Casa de Condomínio em Gambôa do Belém (Cunhambebe)',
    'Ref: 2694. Proprietário: Gustavo Braga. Telefone:  +5521993001189',
    'casa',
    'venda',
    0,
    6,
    1,
    2,
    150,
    'Ponta dos Ubás, 000',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4244',
    'Cobertura em Gambôa do Belém (Cunhambebe)',
    'Ref: 4244. Proprietário: Leticia Angra. Telefone:  +5511933227273',
    'cobertura',
    'venda',
    650000,
    2,
    2,
    2,
    82,
    'Porto Caiera, S/N',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3959',
    'Cobertura em Gambôa do Belém (Cunhambebe)',
    'Ref: 3959. Proprietário: William. Telefone:  +5524974010450',
    'cobertura',
    'venda',
    650000,
    2,
    2,
    1,
    5000,
    'Porto Caiera, S/N',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6906',
    'Casa em Gambôa do Belém (Cunhambebe)',
    'Ref: 6906. Proprietário: ALEXANDRE ARAUJO VIANNA RIBEIRO. Telefone:  +5524992853902',
    'casa',
    'aluguel',
    5500000,
    4,
    5,
    5,
    1100,
    'Porto Caiera, ',
    'Gambôa do Belém (Cunhambebe)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8094',
    'Terreno em Mombaça',
    'Ref: 8094. Proprietário: charles. Telefone:  +5521988018882',
    'terreno',
    'venda',
    800000,
    0,
    0,
    0,
    350,
    'Ponta camorim, 106',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6888',
    'Casa de Condomínio em Mombaça',
    'Ref: 6888. Proprietário: Gualter proprietario ic3. Telefone:  +5521999719068',
    'casa',
    'venda',
    22000000,
    7,
    6,
    2,
    580,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4862',
    'Casa de Condomínio em Mombaça',
    'Ref: 4862. Proprietário: Maria Fazenda L13aA. Telefone:  +5524981075787',
    'casa',
    'venda',
    17900000,
    7,
    10,
    8,
    1500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3444',
    'Casa de Condomínio em Mombaça',
    'Ref: 3444. Proprietário: Henrique. Telefone:  +5521966720474',
    'casa',
    'venda',
    2200000,
    4,
    5,
    4,
    1500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4930',
    'Casa em Mombaça',
    'Ref: 4930. Proprietário: Suzana Marçal parceria. Telefone:  +5521999777187',
    'casa',
    'venda',
    7500000,
    8,
    2,
    4,
    38000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5333',
    'Casa de Condomínio em Mombaça',
    'Ref: 5333. Proprietário: FABIO INACIO DA CUNHA. Telefone:  +5561999812656',
    'casa',
    'venda',
    3700000,
    5,
    5,
    2,
    38000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5020',
    'Casa em Mombaça',
    'Ref: 5020. Proprietário: IVO. Telefone:  +5521981195987',
    'casa',
    'venda',
    3299990,
    4,
    3,
    2,
    38000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 10',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '21843',
    'Terreno em Mombaça',
    'Ref: 21843. Proprietário: Carlos Egon proprietario. Telefone:  +5521996019600',
    'terreno',
    'venda',
    13000000,
    0,
    0,
    0,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 471',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8519',
    'Casa de Condomínio em Mombaça',
    'Ref: 8519. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    2500000,
    4,
    4,
    2,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9898',
    'Casa de Condomínio em Mombaça',
    'Ref: 9898. Proprietário: Felicidade. Telefone:  +5521988122222',
    'casa',
    'venda',
    23000000,
    7,
    8,
    10,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2420',
    'Casa de Condomínio em Mombaça',
    'Ref: 2420. Proprietário: Victor. Telefone:  +5521988352005',
    'casa',
    'venda',
    15000000,
    6,
    6,
    3,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9204',
    'Casa de Condomínio em Mombaça',
    'Ref: 9204. Proprietário: Rodrigo Chambarelli. Telefone:  +5521967542660',
    'casa',
    'venda',
    3400000,
    4,
    4,
    2,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9955',
    'Casa de Condomínio em Mombaça',
    'Ref: 9955. Proprietário: francisco proprietario virada do leste 13. Telefone:  +5521994050480',
    'casa',
    'venda',
    13000000,
    6,
    8,
    3,
    25500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7830',
    'Terreno em Mombaça',
    'Ref: 7830. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'terreno',
    'venda',
    8000000,
    0,
    0,
    0,
    1000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7978',
    'Casa de Condomínio em Mombaça',
    'Ref: 7978. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    120000000,
    16,
    17,
    10,
    244247,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '772',
    'Casa em Mombaça',
    'Ref: 772. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    45000000,
    9,
    12,
    0,
    15000,
    'Ilha do Cavaco, ilha',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5969',
    'Casa em Mombaça',
    'Ref: 5969. Proprietário: Claudia pier 88. Telefone:  +5521999383249',
    'casa',
    'aluguel',
    0,
    4,
    5,
    0,
    15000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3780',
    'Casa de Condomínio em Mombaça',
    'Ref: 3780. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    0,
    4,
    7,
    4,
    3000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4477',
    'Casa de Condomínio em Mombaça',
    'Ref: 4477. Proprietário: miriam. Telefone:  +5524999949992',
    'casa',
    'venda',
    50000000,
    8,
    10,
    15,
    1950,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3031',
    'Casa de Condomínio em Mombaça',
    'Ref: 3031. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    1300000,
    4,
    6,
    1,
    4500,
    'Ponta camorim, 106',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9320',
    'Casa de Condomínio em Mombaça',
    'Ref: 9320. Proprietário: Ana Haegler. Telefone:  +5521981112117',
    'casa',
    'venda',
    0,
    7,
    10,
    3,
    4500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8012',
    'Casa de Condomínio em Mombaça',
    'Ref: 8012. Proprietário: Sr. Mello casa Pier88. Telefone:  +5521988580001',
    'casa',
    'venda',
    2100000,
    4,
    3,
    2,
    4500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3374',
    'Casa de Condomínio em Mombaça',
    'Ref: 3374. Proprietário: Mauricio casa 1 pier 88. Telefone:  +5519992049828',
    'casa',
    'venda',
    2000000,
    4,
    3,
    2,
    4500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8797',
    'Casa de Condomínio em Mombaça',
    'Ref: 8797. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    0,
    4,
    5,
    3,
    4500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9449',
    'Casa de Condomínio em Mombaça',
    'Ref: 9449. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    0,
    5,
    7,
    3,
    4500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7701',
    'Casa de Condomínio em Mombaça',
    'Ref: 7701. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    6500000,
    5,
    6,
    2,
    1980,
    'Rodovia Procurador Haroldo Fernandes Duarte, 000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6459',
    'Casa de Condomínio em Mombaça',
    'Ref: 6459. Proprietário: Ricardo Tranjan. Telefone:  +5521981114466',
    'casa',
    'venda',
    0,
    4,
    5,
    2,
    1980,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1496',
    'Casa de Condomínio em Mombaça',
    'Ref: 1496. Proprietário: IDJAYME Proprietario  Pier 88. Telefone:  +5521999463467',
    'casa',
    'venda',
    2200000,
    4,
    3,
    3,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4726',
    'Casa de Condomínio em Mombaça',
    'Ref: 4726. Proprietário: cintia secretária dona elaine chokyo. Telefone:  +5524998334020',
    'casa',
    'venda',
    0,
    6,
    6,
    3,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '34906',
    'Casa de Condomínio em Mombaça',
    'Ref: 34906. Proprietário: Marcia Jordão. Telefone:  +5521971036460',
    'casa',
    'venda',
    0,
    5,
    5,
    5,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4513',
    'Casa de Condomínio em Mombaça',
    'Ref: 4513. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    0,
    5,
    7,
    3,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7765',
    'Casa em Mombaça',
    'Ref: 7765. Proprietário: Celia proprietaria casa mombaça 10mi. Telefone:  +5521999845716',
    'casa',
    'venda',
    12000000,
    8,
    10,
    4,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 00000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4884',
    'Casa de Condomínio em Mombaça',
    'Ref: 4884. Proprietário: Wagner Nascimento proprietário casa 14 ponta mombaça. Telefone:  +5521981336644',
    'casa',
    'venda',
    4500000,
    5,
    7,
    2,
    250,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3523',
    'Casa de Condomínio em Mombaça',
    'Ref: 3523. Proprietário: vagner proprietario casa ponta dos ubas 4,5mi. Telefone:  +5521999875870',
    'casa',
    'venda',
    40000000,
    6,
    9,
    6,
    1300,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8877',
    'Casa de Condomínio em Mombaça',
    'Ref: 8877. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    2950000,
    4,
    5,
    2,
    30000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7928',
    'Casa de Condomínio em Mombaça',
    'Ref: 7928. Proprietário: claudio casa 05 ponta da mombaça proprietario. Telefone:  +5521988827519',
    'casa',
    'venda',
    5700000,
    4,
    6,
    3,
    30000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 475',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9404',
    'Casa de Condomínio em Mombaça',
    'Ref: 9404. Proprietário: Luanne Assistente Pessoal. Telefone:  +5521998477227',
    'casa',
    'aluguel',
    2600000,
    4,
    5,
    1,
    30000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8882',
    'Casa de Condomínio em Mombaça',
    'Ref: 8882. Proprietário: comandante malaguti. Telefone:  +5521992226001',
    'casa',
    'venda',
    8000000,
    7,
    9,
    5,
    30000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8106',
    'Casa em Mombaça',
    'Ref: 8106. Proprietário: Sergio proprietario sitio do bosque. Telefone:  +5511982919968',
    'casa',
    'venda',
    6000000,
    6,
    6,
    0,
    30000,
    'Ilha da Gipóia, 001',
    'Mombaça',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8026',
    'Casa em Camorim Pequeno',
    'Ref: 8026. Proprietário: Josepy proprietário da Blue. Telefone:  +5524999451532',
    'casa',
    'venda',
    50000000,
    24,
    20,
    15,
    30000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 0000',
    'Camorim Pequeno',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4164',
    'Casa em Camorim Pequeno',
    'Ref: 4164. Proprietário: Jomari Prop.. Telefone:  +5521993019900',
    'casa',
    'venda',
    4500000,
    4,
    3,
    3,
    500,
    'Rodovia Procurador Haroldo Fernandes Duarte, 4',
    'Camorim Pequeno',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '65261',
    'Casa em Camorim',
    'Ref: 65261. Proprietário: Vivi Jorás. Telefone:  +5521988711939',
    'casa',
    'venda',
    2400000,
    2,
    1,
    3,
    1694,
    'Rua Paz e Bem, 703',
    'Camorim',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3732',
    'Terreno em Biscaia',
    'Ref: 3732. Proprietário: Sara Lima Adm Apt Porto Real. Telefone:  +351914514701',
    'terreno',
    'venda',
    1400000,
    0,
    0,
    0,
    1073.4,
    'Avenida Antônio Bertholdo da Silva Jordão, LOTE 8-C',
    'Biscaia',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4748',
    'Casa em Ponta Leste',
    'Ref: 4748. Proprietário: norton proprietario casa ponta leste antiga terreno grande. Telefone:  +5521969827200',
    'casa',
    'venda',
    4500000,
    5,
    6,
    4,
    2100,
    'Avenida Antônio Bertholdo da Silva Jordão, 4578',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '43957',
    'Apartamento em Ponta Leste',
    'Ref: 43957. Proprietário: LOWANY. Telefone:  +5532998115272',
    'apartamento',
    'venda',
    750000,
    2,
    2,
    1,
    69,
    'Avenida Antônio Bertholdo da Silva Jordão, ',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1060',
    'Casa em Ponta Leste',
    'Ref: 1060. Proprietário: Nívea Bordin Chacur. Telefone:  +5521984965622',
    'casa',
    'venda',
    0,
    7,
    10,
    3,
    1500,
    'Avenida Antônio Bertholdo da Silva Jordão, 00',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6932',
    'Casa em Ponta Leste',
    'Ref: 6932. Proprietário: Júlia Hermeto. Telefone:  +5521988669601',
    'casa',
    'venda',
    3800000,
    6,
    4,
    4,
    2100,
    'Avenida Antônio Bertholdo da Silva Jordão, 0000',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4271',
    'Pousada em Ponta Leste',
    'Ref: 4271. Proprietário: Sr Roberto Casa Ponta Leste. Telefone:  +5521986327400',
    'casa',
    'venda',
    4100000,
    22,
    23,
    22,
    55570,
    'Avenida Antônio Bertholdo da Silva Jordão, 0000',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3354',
    'Pousada em Ponta Leste',
    'Ref: 3354. Proprietário: Mário Marcio. Telefone:  +5524999038088',
    'casa',
    'venda',
    5750000,
    3,
    3,
    3,
    850,
    'Rua do Monumento, S/n',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5691',
    'Casa em Ponta Leste',
    'Ref: 5691. Proprietário: Rosangela casa do escorrega. Telefone:  +5521988918690',
    'casa',
    'venda',
    12000000,
    10,
    12,
    6,
    6000,
    'Avenida Antônio Bertholdo da Silva Jordão, 000000',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5337',
    'Casa de Condomínio em Ponta Leste',
    'Ref: 5337. Proprietário: Rômulo. Telefone:  +5521980001084',
    'casa',
    'venda',
    3999990,
    4,
    6,
    3,
    6000,
    'Rua do Monumento, ',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7577',
    'Casa em Ponta Leste',
    'Ref: 7577. Proprietário: Rômulo. Telefone:  +351912274869',
    'casa',
    'venda',
    8990000,
    4,
    1,
    3,
    6000,
    'Avenida Antônio Bertholdo da Silva Jordão, 8350',
    'Ponta Leste',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6780',
    'Casa de Condomínio em Portogalo',
    'Ref: 6780. Proprietário: denis proprietario E31 portogalo. Telefone:  +5521993603778',
    'casa',
    'venda',
    7499990,
    5,
    8,
    4,
    2000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8499',
    'Casa de Condomínio em Portogalo',
    'Ref: 8499. Proprietário: Leone proprietaria portogalo costeira gleba E. Telefone:  +5521964088989',
    'casa',
    'venda',
    12750000,
    6,
    8,
    3,
    2000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6597',
    'Casa de Condomínio em Portogalo',
    'Ref: 6597. Proprietário: Fabio. Telefone:  +5521970181905',
    'casa',
    'venda',
    5250000,
    12,
    12,
    5,
    3111,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1248',
    'Casa de Condomínio em Portogalo',
    'Ref: 1248. Proprietário: Fernanda Proprietária Portogalo. Telefone:  +5521996849220',
    'casa',
    'venda',
    20000000,
    5,
    7,
    3,
    3111,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9954',
    'Casa de Condomínio em Portogalo',
    'Ref: 9954. Proprietário: Amim proprietário vilage 2 portogalo. Telefone:  +5521964383436',
    'casa',
    'venda',
    3000000,
    6,
    5,
    2,
    250,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6909',
    'Casa de Condomínio em Portogalo',
    'Ref: 6909. Proprietário: Elaine. Telefone:  +5524999959990',
    'casa',
    'venda',
    4999900,
    5,
    4,
    3,
    3111,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1747',
    'Casa de Condomínio em Portogalo',
    'Ref: 1747. Proprietário: Luiz. Telefone:  +5521999836481',
    'casa',
    'venda',
    4200000,
    4,
    5,
    2,
    3111,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2189',
    'Casa de Condomínio em Portogalo',
    'Ref: 2189. Proprietário: Solange Proprietaria Casa porro Galo. Telefone:  +5521998232531',
    'casa',
    'venda',
    2300000,
    3,
    4,
    3,
    300,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7814',
    'Casa de Condomínio em Portogalo',
    'Ref: 7814. Proprietário: henrique corretor filho armando. Telefone:  +5521972880173',
    'casa',
    'venda',
    3200000,
    5,
    3,
    12,
    2078,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3242',
    'Casa de Condomínio em Portogalo',
    'Ref: 3242. Proprietário: JOSE SALVADOR CARLOS CAMPANHA. Telefone:  +5521999852734',
    'casa',
    'venda',
    9500000,
    7,
    9,
    5,
    2078,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2595',
    'Casa de Condomínio em Portogalo',
    'Ref: 2595. Proprietário: Flávia Portogalo vilage. Telefone:  +5524999517286',
    'casa',
    'venda',
    2999990,
    5,
    5,
    2,
    2078,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7317',
    'Terreno em Portogalo',
    'Ref: 7317. Proprietário: Caio Bramil. Telefone:  +5524998154620',
    'terreno',
    'venda',
    8500000,
    0,
    0,
    0,
    15000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8531',
    'Casa de Condomínio em Portogalo',
    'Ref: 8531. Proprietário: Tinindo Alvaro Novis Casa Porto Galo Vila. Telefone:  +5521999929878',
    'casa',
    'venda',
    6300000,
    4,
    5,
    2,
    15000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5602',
    'Casa de Condomínio em Portogalo',
    'Ref: 5602. Proprietário: Eduardo Porto. Telefone:  +5521996055538',
    'casa',
    'venda',
    3490000,
    5,
    8,
    5,
    1310,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8234',
    'Casa de Condomínio em Portogalo',
    'Ref: 8234. Proprietário: Joelma Caseira. Telefone:  +5521982181466',
    'casa',
    'venda',
    0,
    9,
    10,
    4,
    1310,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9847',
    'Casa de Condomínio em Portogalo',
    'Ref: 9847. Proprietário: Carlos Badin. Telefone:  +5521995420514',
    'casa',
    'venda',
    0,
    5,
    6,
    4,
    1310,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6500',
    'Casa de Condomínio em Portogalo',
    'Ref: 6500. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    6500000,
    4,
    5,
    6,
    1650,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6299',
    'Casa de Condomínio em Portogalo',
    'Ref: 6299. Proprietário: paulo lobo proprietario portogalo 14mi. Telefone:  +5521999854897',
    'casa',
    'venda',
    14000000,
    6,
    8,
    3,
    1659,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3349',
    'Casa de Condomínio em Portogalo',
    'Ref: 3349. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'casa',
    'venda',
    14500000,
    6,
    8,
    4,
    7750,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4224',
    'Casa de Condomínio em Portogalo',
    'Ref: 4224. Proprietário: baiano funcionario da casa. Telefone:  +5524998256561',
    'casa',
    'venda',
    10000000,
    5,
    6,
    10,
    756,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2515',
    'Casa de Condomínio em Portogalo',
    'Ref: 2515. Proprietário: Valdomiro casa PortoGalo. Telefone:  +5524992137661',
    'casa',
    'venda',
    6500000,
    5,
    5,
    8,
    756,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4046',
    'Casa de Condomínio em Portogalo',
    'Ref: 4046. Proprietário: Adriana Gomes. Telefone:  +5521964026393',
    'casa',
    'venda',
    0,
    5,
    6,
    3,
    756,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7983',
    'Casa de Condomínio em Portogalo',
    'Ref: 7983. Proprietário: Mario caseiro casa D17. Telefone:  +5521995711955',
    'casa',
    'venda',
    2800000,
    4,
    3,
    6,
    260,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3945',
    'Casa de Condomínio em Portogalo',
    'Ref: 3945. Proprietário: Aguinaldo Porto Galo Casa Amarela B11. Telefone:  +5524974019235',
    'casa',
    'venda',
    3900000,
    6,
    6,
    6,
    450,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2480',
    'Casa em Portogalo',
    'Ref: 2480. Proprietário: Alice. Telefone:  +5521999580977',
    'casa',
    'venda',
    13500000,
    6,
    7,
    3,
    700,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2020',
    'Casa de Condomínio em Portogalo',
    'Ref: 2020. Proprietário: gilberto proprietario porto galo D58. Telefone:  +5521970328615',
    'casa',
    'venda',
    3200000,
    9,
    6,
    6,
    2560,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6362',
    'Casa de Condomínio em Portogalo',
    'Ref: 6362. Proprietário: Orlando Prop. Casa Portogalo. Telefone:  +5521993582613',
    'casa',
    'venda',
    3500000,
    5,
    6,
    5,
    400,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4063',
    'Casa de Condomínio em Portogalo',
    'Ref: 4063. Proprietário: Ana paula D14. Telefone:  +5521993839488',
    'casa',
    'venda',
    4500000,
    6,
    7,
    0,
    1200,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5475',
    'Casa de Condomínio em Portogalo',
    'Ref: 5475. Proprietário: Marisa Gleba. Telefone:  +5521998564540',
    'casa',
    'venda',
    10000000,
    5,
    4,
    8,
    1200,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9706',
    'Casa de Condomínio em Portogalo',
    'Ref: 9706. Proprietário: Marcelo k6. Telefone:  +5561982112882',
    'casa',
    'venda',
    3000000,
    4,
    5,
    4,
    1200,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6568',
    'Casa de Condomínio em Portogalo',
    'Ref: 6568. Proprietário: Francisco D12. Telefone:  +5521992194020',
    'casa',
    'venda',
    2645000,
    3,
    2,
    1,
    1200,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6091',
    'Casa de Condomínio em Portogalo',
    'Ref: 6091. Proprietário: Dilson Palmer Gleba I E I. Telefone:  +5521975150767',
    'casa',
    'venda',
    2600000,
    8,
    8,
    3,
    490,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7472',
    'Casa de Condomínio em Portogalo',
    'Ref: 7472. Proprietário: Dilson Palmer Gleba I E I. Telefone:  +5521975150767',
    'casa',
    'venda',
    1900000,
    4,
    3,
    3,
    650,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4957',
    'Casa de Condomínio em Portogalo',
    'Ref: 4957. Proprietário: Marcelo Prop.Casa L22 Portogalo. Telefone:  +5521988890959',
    'casa',
    'venda',
    4000000,
    7,
    8,
    3,
    1900,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8323',
    'Casa de Condomínio em Portogalo',
    'Ref: 8323. Proprietário: Daniele Macieis Casa A Direita. Telefone:  +5521972823003',
    'casa',
    'venda',
    29999900,
    10,
    11,
    5,
    1000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5738',
    'Casa em Portogalo',
    'Ref: 5738. Proprietário: Jael Menezes. Telefone:  +5521972284151',
    'casa',
    'venda',
    0,
    4,
    5,
    3,
    20220.85,
    'Condomínio Portogalo, S/N',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7779',
    'Casa de Condomínio em Portogalo',
    'Ref: 7779. Proprietário: Weverton Adm. Telefone:  +5524998235854',
    'casa',
    'venda',
    22000000,
    6,
    7,
    10,
    20220.85,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5920',
    'Casa de Condomínio em Portogalo',
    'Ref: 5920. Proprietário: Renata adm. Telefone:  +5521992288728',
    'casa',
    'venda',
    0,
    6,
    8,
    3,
    20220.85,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9747',
    'Casa em Portogalo',
    'Ref: 9747. Proprietário: Jader. Telefone:  +5521979376042',
    'casa',
    'venda',
    2300000,
    4,
    3,
    0,
    20220.85,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9290',
    'Casa de Condomínio em Portogalo',
    'Ref: 9290. Proprietário: marcelo dono f11 portogalo. Telefone:  +5521999821181',
    'casa',
    'venda',
    9800000,
    5,
    7,
    8,
    1000,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8397',
    'Casa em Portogalo',
    'Ref: 8397. Proprietário: Dr.Renata. Telefone:  +5521992204710',
    'casa',
    'venda',
    0,
    7,
    5,
    0,
    5500,
    'Condomínio Portogalo, ',
    'Portogalo',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8238',
    'Casa em Caetés',
    'Ref: 8238. Proprietário: Sandra pontal de Caetes. Telefone:  +5491131221510',
    'casa',
    'venda',
    0,
    5,
    6,
    4,
    5500,
    'Avenida Caetés, 00000',
    'Caetés',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'M-SP-A-84',
    'Casa de Condomínio em Alphaville',
    'Ref: M-SP-A-84. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    18900000,
    6,
    8,
    6,
    5500,
    'ALAMEDA MOREA, 382',
    'Alphaville',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7876',
    'Casa de Condomínio em Alphaville',
    'Ref: 7876. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    19800000,
    6,
    6,
    6,
    5500,
    'ALAMEDA MOREA, 382',
    'Alphaville',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF100424',
    'Casa de Condomínio em Dunas do Peró',
    'Ref: LC-LCF100424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1390000,
    3,
    4,
    3,
    600,
    'Estrada do Guriri, 2090',
    'Dunas do Peró',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF250224',
    'Casa em Foguete',
    'Ref: LC-LCF250224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2200000,
    8,
    0,
    5,
    390,
    'Avenida dos Bosques, 22',
    'Foguete',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4744',
    'Casa de Condomínio em Cidade Tamboré',
    'Ref: 4744. Proprietário: MAPA IMOBILIARIA E CONSTRUTORA. Telefone:  +5511973008192',
    'casa',
    'venda',
    35000000,
    8,
    9,
    10,
    5500,
    'Alameda da Campina, 685',
    'Cidade Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5798',
    'Terreno em Cidade Tamboré',
    'Ref: 5798. Proprietário: Pedro Damatis. Telefone:  +5524988088888',
    'terreno',
    'venda',
    5900000,
    0,
    0,
    0,
    1654,
    'Alameda da Campina, 685',
    'Cidade Tamboré',
    'Santana de Parnaíba',
    'SP',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ310525',
    'Casa de Condomínio em João Fernandes',
    'Ref: LC-LBZ310525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    10000000,
    5,
    6,
    6,
    1700,
    'Rua João Fernandes, 1',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA130923',
    'Casa de Condomínio em João Fernandes',
    'Ref: LC-LA130923. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    10000000,
    5,
    6,
    6,
    1500,
    'Rua João Fernandes, 1',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0303233',
    'Terreno em João Fernandes',
    'Ref: LC-LA0303233. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    1800000,
    0,
    0,
    0,
    1654,
    'Rua Quatro, 01',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA030822',
    'Casa em João Fernandes',
    'Ref: LC-LA030822. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    10000000,
    7,
    8,
    4,
    2904,
    'SEM NOME, 543',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA021221',
    'Casa de Condomínio em João Fernandes',
    'Ref: LC-LA021221. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5000000,
    4,
    5,
    2,
    1654,
    'sem nome, 02',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0505211',
    'Casa em João Fernandes',
    'Ref: LC-LA0505211. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5900000,
    9,
    10,
    5,
    2000,
    'sem nome, 88',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA030321',
    'Casa em João Fernandes',
    'Ref: LC-LA030321. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6200000,
    7,
    8,
    10,
    600,
    'Rua João Fernandes, 40',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA050321',
    'Casa em João Fernandes',
    'Ref: LC-LA050321. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    6,
    7,
    10,
    1300,
    'Rua João Fernandes, 60',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ160224',
    'Casa de Condomínio em João Fernandes',
    'Ref: LC-LBZ160224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3500000,
    4,
    4,
    4,
    8325,
    'Q, 6',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ301223',
    'Casa em João Fernandes',
    'Ref: LC-LBZ301223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3800000,
    3,
    3,
    6,
    2000,
    'Rua João Fernandes, 009',
    'João Fernandes',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ150825',
    'Casa em Ossos',
    'Ref: LC-LBZ150825. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    6,
    8,
    6,
    1983,
    'Rua Praia dos Ossos, 50',
    'Ossos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ020224',
    'Casa em Brava',
    'Ref: LC-LBZ020224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    26000000,
    6,
    7,
    4,
    9659,
    'Rua Ilha Branca, 1',
    'Brava',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ270525',
    'Casa de Condomínio em Forno',
    'Ref: LC-LBZ270525. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2600000,
    4,
    5,
    4,
    600,
    'Rua Pastor Gentil, 298',
    'Forno',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA241222',
    'Casa de Condomínio em Forno',
    'Ref: LC-LA241222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3200000,
    4,
    5,
    2,
    1654,
    'SEM NOME, 45362',
    'Forno',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA281021',
    'Casa de Condomínio em Forno',
    'Ref: LC-LA281021. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3300000,
    6,
    5,
    4,
    1000,
    'sem nome, 1222',
    'Forno',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ221223',
    'Casa em Forno',
    'Ref: LC-LBZ221223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    8,
    5,
    6,
    1500,
    'Avenida do Forno, 22222',
    'Forno',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ011224',
    'Hotel em Ferradura',
    'Ref: LC-LBZ011224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3850000,
    19,
    23,
    6,
    4500,
    'Rua Alto da Ferradura, 00',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ231124',
    'Casa em Ferradura',
    'Ref: LC-LBZ231124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    6,
    5,
    4,
    1783,
    'D, 4',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ051024',
    'Casa em Ferradura',
    'Ref: LC-LBZ051024. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4500000,
    6,
    5,
    4,
    3600,
    'E, 3',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA060923',
    'Casa em Ferradura',
    'Ref: LC-LA060923. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3950000,
    5,
    6,
    6,
    3218,
    'Rua E, ',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ041123',
    'Casa em Ferradura',
    'Ref: LC-LBZ041123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4390000,
    3,
    3,
    4,
    1800,
    'SEM NOME, 1',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA110323',
    'Casa em Ferradura',
    'Ref: LC-LA110323. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6200000,
    5,
    6,
    3,
    1000,
    'Praia da Ferradura, 009778',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220822',
    'Casa em Ferradura',
    'Ref: LC-LA220822. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4200000,
    4,
    4,
    3,
    1800,
    'SEM NOME, 3214',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA070622',
    'Casa em Ferradura',
    'Ref: LC-LA070622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3200000,
    7,
    8,
    3,
    1500,
    'SEM NOME, 876',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220422',
    'Casa em Ferradura',
    'Ref: LC-LA220422. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    9,
    8,
    5,
    1300,
    'SEM NOME, 65',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA080222',
    'Casa em Ferradura',
    'Ref: LC-LA080222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4200000,
    6,
    7,
    11,
    1500,
    'Rua Federalina Corrêa de Amora Maciel - Sinhá D''Amora, 2',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA150222',
    'Casa em Ferradura',
    'Ref: LC-LA150222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7000000,
    6,
    7,
    6,
    2500,
    'Rua Federalina Corrêa de Amora Maciel - Sinhá D''Amora, 8',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA181121',
    'Casa em Ferradura',
    'Ref: LC-LA181121. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4200000,
    6,
    7,
    8,
    1250,
    'sem nome, 4343',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2707213',
    'Casa em Ferradura',
    'Ref: LC-LA2707213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5100000,
    5,
    7,
    2,
    2000,
    'sem nome, 1515',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2910214',
    'Hotel em Ferradura',
    'Ref: LC-LA2910214. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    17500000,
    34,
    35,
    10,
    6129,
    'sem nome, 8888',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA260421',
    'Casa em Ferradura',
    'Ref: LC-LA260421. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    5,
    7,
    3,
    1000,
    'sem nome, 200',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA130521',
    'Casa em Ferradura',
    'Ref: LC-LA130521. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    18000000,
    6,
    7,
    4,
    1300,
    'sem nome, 777',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA100421',
    'Casa em Ferradura',
    'Ref: LC-LA100421. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    5,
    6,
    2,
    1000,
    'sem nome martin, 55',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0504213',
    'Casa em Ferradura',
    'Ref: LC-LA0504213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    6,
    7,
    6,
    1600,
    'sem nome, 88',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA160321',
    'Casa em Ferradura',
    'Ref: LC-LA160321. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    9000000,
    6,
    7,
    2,
    600,
    'sem nome, 38',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA190421',
    'Casa em Ferradura',
    'Ref: LC-LA190421. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7250000,
    11,
    12,
    8,
    2500,
    'sem nome, 77',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2303213',
    'Casa em Ferradura',
    'Ref: LC-LA2303213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    30000000,
    5,
    7,
    6,
    3200,
    'casa suely, 28',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2502212',
    'Casa em Ferradura',
    'Ref: LC-LA2502212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3000000,
    5,
    5,
    4,
    650,
    'sem nome, s n',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2303212',
    'Casa em Ferradura',
    'Ref: LC-LA2303212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    20000000,
    6,
    8,
    6,
    1000,
    'Praia da ferradura, 22',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA260521',
    'Casa em Ferradura',
    'Ref: LC-LA260521. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7000000,
    9,
    9,
    6,
    1500,
    'sem nome, 111',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0207211',
    'Casa de Condomínio em Ferradura',
    'Ref: LC-LA0207211. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4000000,
    4,
    5,
    2,
    1654,
    'sem nome, 1010',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2903213',
    'Casa em Ferradura',
    'Ref: LC-LA2903213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5200000,
    5,
    7,
    4,
    1550,
    'sem nome, 23',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ230324',
    'Casa em Ferradura',
    'Ref: LC-LBZ230324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6900000,
    7,
    8,
    15,
    2250,
    'U, 7',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA150723',
    'Casa em Ferradura',
    'Ref: LC-LA150723. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    17000000,
    5,
    7,
    6,
    2080,
    'SEM NOME, 2233221',
    'Ferradura',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ151123',
    'Casa de Condomínio em Alto de Búzios',
    'Ref: LC-LBZ151123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2000000,
    4,
    5,
    4,
    482,
    'Avenida José Bento Ribeiro Dantas, ',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ251023',
    'Casa de Condomínio em Alto de Búzios',
    'Ref: LC-LBZ251023. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2000000,
    4,
    5,
    4,
    482,
    'Avenida José Bento Ribeiro Dantas, 14',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA240723',
    'Casa em Alto de Búzios',
    'Ref: LC-LA240723. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2500000,
    5,
    4,
    6,
    1040,
    'Rua João Vaz Coutinho, 000',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA020422',
    'Casa em Alto de Búzios',
    'Ref: LC-LA020422. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    9,
    12,
    8,
    5000,
    'Rua alto de Búzios, 45',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA111221',
    'Casa de Condomínio em Alto de Búzios',
    'Ref: LC-LA111221. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4400000,
    6,
    6,
    6,
    1300,
    'AA, A',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA1705212',
    'Casa em Alto de Búzios',
    'Ref: LC-LA1705212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4900000,
    8,
    10,
    4,
    1250,
    'sem nome, 101',
    'Alto de Búzios',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ300524',
    'Casa em Ferradurinha',
    'Ref: LC-LBZ300524. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3600000,
    2,
    2,
    4,
    705.99,
    'G, 44',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0303234',
    'Terreno em Ferradurinha',
    'Ref: LC-LA0303234. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    7000000,
    0,
    0,
    0,
    1654,
    'Estrada Da Ferradurinha, 01',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA210622',
    'Casa de Condomínio em Ferradurinha',
    'Ref: LC-LA210622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2500000,
    4,
    5,
    2,
    750,
    'SEM NOME, 8',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA080622',
    'Casa em Ferradurinha',
    'Ref: LC-LA080622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4500000,
    4,
    5,
    0,
    890,
    'SEM NOME, 04',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA311222',
    'Casa em Ferradurinha',
    'Ref: LC-LA311222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4000000,
    3,
    4,
    3,
    731,
    'sem nome, 8888',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA291021',
    'Casa de Condomínio em Ferradurinha',
    'Ref: LC-LA291021. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5000000,
    4,
    5,
    3,
    1050,
    'sem nome, 5656',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2910211',
    'Casa em Ferradurinha',
    'Ref: LC-LA2910211. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5500000,
    4,
    5,
    2,
    730,
    'sem nome, 5555',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2707211',
    'Casa em Ferradurinha',
    'Ref: LC-LA2707211. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6500000,
    6,
    7,
    4,
    1200,
    'sem nome, 1111',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA1608212',
    'Casa de Condomínio em Ferradurinha',
    'Ref: LC-LA1608212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7000000,
    5,
    7,
    4,
    1369,
    'sem nome, 1616',
    'Ferradurinha',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA240323',
    'Casa em Geribá',
    'Ref: LC-LA240323. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2780000,
    4,
    6,
    4,
    360,
    'Avenida José Bento Ribeiro Dantas, 11121',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LA060523',
    'Casa de Condomínio em Geribá',
    'Ref: LA060523. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3950000,
    4,
    5,
    6,
    5212.7,
    'Rua Geriba, 01',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA100623',
    'Casa em Geribá',
    'Ref: LC-LA100623. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4990000,
    10,
    11,
    6,
    800,
    'Geribá tenis park, 01',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ100425',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LBZ100425. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1700000,
    3,
    2,
    2,
    273,
    'Rua 46, 16',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ200124',
    'Hotel em Geribá',
    'Ref: LC-LBZ200124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4200000,
    16,
    17,
    4,
    1499.98,
    'Rua Oitis, 9',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA260922',
    'Casa em Geribá',
    'Ref: LC-LA260922. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2100000,
    4,
    6,
    2,
    300,
    'SEM NOME, 13546',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA281122',
    'Casa em Geribá',
    'Ref: LC-LA281122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2800000,
    5,
    2,
    4,
    760,
    'Tennis Park, 1',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA050922',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA050922. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    5,
    6,
    2,
    800,
    'SEM NOME, 658',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA261122',
    'Casa em Geribá',
    'Ref: LC-LA261122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2900000,
    8,
    9,
    4,
    812.5,
    'Rua do Caboclo, 2',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA240311',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA240311. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3000000,
    4,
    4,
    1,
    1654,
    'SEM NOME, 23',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA280422',
    'Casa em Geribá',
    'Ref: LC-LA280422. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3000000,
    6,
    7,
    8,
    885,
    'Rua Peroba, 43',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ090825',
    'Casa em Geribá',
    'Ref: LC-LBZ090825. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    6,
    6,
    2,
    800,
    'Rua Gerbert Perissé, 1410',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA231121',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA231121. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2600000,
    4,
    7,
    6,
    776,
    'sem nome, 3333',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA3011213',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA3011213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    18000000,
    7,
    6,
    4,
    536.29,
    'sem nome, 87654',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2910212',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA2910212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    11000000,
    7,
    8,
    4,
    3800,
    'sem nome, 55554',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA300721',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LA300721. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6300000,
    5,
    7,
    4,
    4312.9,
    'sem nome, 1717',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA060321',
    'Casa em Geribá',
    'Ref: LC-LA060321. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1600000,
    7,
    5,
    5,
    500,
    'Rua das Andorinhas, 16',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ100824',
    'Casa em Geribá',
    'Ref: LC-LBZ100824. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4300000,
    5,
    6,
    3,
    599.99,
    '7U, 2',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ170524',
    'Casa de Condomínio em Geribá',
    'Ref: LC-LBZ170524. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2600000,
    4,
    4,
    2,
    1654,
    'Q, 2',
    'Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ050425',
    'Casa em Manguinhos',
    'Ref: LC-LBZ050425. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6800000,
    6,
    7,
    4,
    2000,
    'Rua das Pitangas, 345',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ191024',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ191024. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5600000,
    4,
    4,
    2,
    240,
    'ER, 2',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ021124',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ021124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3000000,
    5,
    5,
    2,
    600,
    'sem nome, 22',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ240824',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ240824. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3150000,
    6,
    6,
    2,
    600,
    'sem nome, 22',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ300624',
    'Casa em Manguinhos',
    'Ref: LC-LBZ300624. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7000000,
    6,
    6,
    4,
    1160,
    'Q, 1',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA150622',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA150622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    8000000,
    5,
    6,
    3,
    900,
    'SEM NOME, 43',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA200822',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA200822. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2650000,
    4,
    5,
    2,
    550,
    'SEM NOME, 9876',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ151223',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ151223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1950000,
    6,
    6,
    6,
    59.3,
    'Av. José Bento Ribeiro Dantas, 456',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA250222',
    'Casa em Manguinhos',
    'Ref: LC-LA250222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    19000000,
    6,
    7,
    5,
    8710,
    'sem nome, 09',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220322',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA220322. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3950000,
    5,
    6,
    2,
    1000,
    'SEM NOME, 00',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA210123',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA210123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7500000,
    6,
    7,
    14,
    4149,
    'sem nome, 07',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA240122',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA240122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    15000000,
    5,
    6,
    6,
    1800,
    'sem nome, 7',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0112212',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LA0112212. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7700000,
    5,
    6,
    3,
    560,
    'sem nome, 4315',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA291121',
    'Casa em Manguinhos',
    'Ref: LC-LA291121. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6000000,
    7,
    8,
    6,
    900,
    'sem nome, 121',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA071021',
    'Casa em Manguinhos',
    'Ref: LC-LA071021. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    16000000,
    7,
    8,
    6,
    3000,
    'sem nomme, 1945',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ130724',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ130724. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5950000,
    5,
    7,
    4,
    695,
    'sem nome, 22',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ070324',
    'Casa de Condomínio em Manguinhos',
    'Ref: LC-LBZ070324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1980000,
    4,
    5,
    2,
    149,
    '4, 15',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ150424',
    'Hotel em Manguinhos',
    'Ref: LC-LBZ150424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    35000000,
    43,
    50,
    40,
    25142.91,
    'I, 9',
    'Manguinhos',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ260725',
    'Casa em Bosque de Geribá',
    'Ref: LC-LBZ260725. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    30000000,
    9,
    11,
    11,
    2200,
    'Rua Iuca, 123469',
    'Bosque de Geribá',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ211224',
    'Casa de Condomínio em Praia Rasa',
    'Ref: LC-LBZ211224. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1400000,
    3,
    3,
    2,
    1654,
    'I, 8',
    'Praia Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ301124',
    'Casa de Condomínio em Praia Rasa',
    'Ref: LC-LBZ301124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1300000,
    3,
    3,
    1,
    1654,
    '5, 6',
    'Praia Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF090424',
    'Terreno em Praia Rasa',
    'Ref: LC-LCF090424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    10000000,
    0,
    0,
    0,
    1654,
    'Rj-102, 0000',
    'Praia Rasa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ120725',
    'Casa em Marina',
    'Ref: LC-LBZ120725. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3500000,
    5,
    7,
    6,
    890,
    'Alameda Flamboyants, 01',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LCF240125',
    'Casa em Marina',
    'Ref: LC-LCF240125. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    10000000,
    6,
    6,
    2,
    1100,
    'R, 9',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA280123',
    'Casa em Marina',
    'Ref: LC-LA280123. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2950000,
    5,
    7,
    2,
    1000,
    'sem nome, 123',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ121024',
    'Casa em Marina',
    'Ref: LC-LBZ121024. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4500000,
    7,
    8,
    3,
    1100,
    'sem nome, 55',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA1702213',
    'Casa em Marina',
    'Ref: LC-LA1702213. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3400000,
    4,
    6,
    4,
    1400,
    'Rua do Canal, 200',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220122',
    'Casa em Marina',
    'Ref: LC-LA220122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    7500000,
    4,
    7,
    2,
    600,
    'Rua 5, 71',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ160324',
    'Casa em Marina',
    'Ref: LC-LBZ160324. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1900000,
    4,
    4,
    6,
    950,
    'I, 8',
    'Marina',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ190425',
    'Casa de Condomínio em Golfe',
    'Ref: LC-LBZ190425. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6800000,
    10,
    11,
    12,
    3200,
    'rua sem nome, 888',
    'Golfe',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ1504241',
    'Casa em Caravelas',
    'Ref: LC-LBZ1504241. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1100000,
    2,
    1,
    5,
    450,
    'Q, 1',
    'Caravelas',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA220522',
    'Casa de Condomínio em Caravelas',
    'Ref: LC-LA220522. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1400000,
    3,
    4,
    2,
    450,
    'SEM NOME, 0000',
    'Caravelas',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ021223',
    'Casa de Condomínio em Caravelas',
    'Ref: LC-LBZ021223. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1980000,
    4,
    3,
    2,
    465,
    'Estrada do Guriri, 4000',
    'Caravelas',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ220225',
    'Casa em Baía Formosa',
    'Ref: LC-LBZ220225. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    6800000,
    4,
    5,
    6,
    1654,
    'X, 2',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ091124',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LBZ091124. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1750000,
    4,
    4,
    2,
    1654,
    'D, 4',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA030323',
    'Terreno em Baía Formosa',
    'Ref: LC-LA030323. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    5500000,
    0,
    0,
    0,
    1654,
    'Avenida José Bento Ribeiro Dantas, 01',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA300323',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA300323. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2200000,
    4,
    5,
    3,
    600,
    'SEM NOME, 009976',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA0303232',
    'Terreno em Baía Formosa',
    'Ref: LC-LA0303232. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'terreno',
    'venda',
    1500000,
    0,
    0,
    0,
    1654,
    'Av José Bento Ribeiro Dantas, 02',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA101122',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA101122. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    5500000,
    4,
    6,
    4,
    750,
    'SEM NOME, 6666',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA101222',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA101222. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4800000,
    4,
    6,
    4,
    750,
    'SEM NOME, 8764',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA140622',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA140622. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    4500000,
    4,
    4,
    2,
    900,
    'SEM NOME, 8053',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA291022',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA291022. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    8000000,
    6,
    6,
    4,
    850,
    'SEM NOME, 9986',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA141022',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA141022. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    2400000,
    4,
    5,
    2,
    395,
    'Rua Iuca, 43687',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA190522',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA190522. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    6,
    7,
    6,
    2000,
    'SEM NOME, 094',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA041021',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA041021. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    3400000,
    5,
    6,
    2,
    400,
    'sem nome, 0000',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA2204211',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LA2204211. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    12000000,
    7,
    10,
    4,
    2000,
    'sem nome, 88',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LBZ210424',
    'Casa de Condomínio em Baía Formosa',
    'Ref: LC-LBZ210424. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'casa',
    'venda',
    1290000,
    3,
    3,
    1,
    1654,
    'W, 2',
    'Baía Formosa',
    'Armação dos Búzios',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    'LC-LA300522',
    'Fazenda em Guriri',
    'Ref: LC-LA300522. Proprietário: THIAGO LACORTE PARCERIA. Telefone:  +5522999982084',
    'rural',
    'venda',
    13500000,
    2,
    1,
    7,
    1360000000,
    'Rua do Guriri, 5000',
    'Guriri',
    'Cabo Frio',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5782',
    'Casa em Araçatiba (Ilha Grande)',
    'Ref: 5782. Proprietário: Patricia araçatiba. Telefone:  +15148393669',
    'casa',
    'venda',
    4800000,
    6,
    7,
    0,
    1654,
    'Praia de araçatiba, 6',
    'Araçatiba (Ilha Grande)',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '49127',
    'Casa em Ilha Grande',
    'Ref: 49127. Proprietário: Mariana Paulon. Telefone:  +5521993232609',
    'casa',
    'venda',
    6000000,
    3,
    2,
    0,
    186.96,
    'Sitio Forte, s/n',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4543',
    'Terreno em Ilha Grande',
    'Ref: 4543. Proprietário: nice proprietaria terreno sitio forte. Telefone:  +5511953073737',
    'terreno',
    'venda',
    10000000,
    0,
    0,
    0,
    200000,
    'Sitio Forte, Ilha Grande, 00',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4544',
    'Terreno em Ilha Grande',
    'Ref: 4544. Proprietário: nice proprietaria terreno sitio forte. Telefone:  +5511953073737',
    'terreno',
    'venda',
    60000000,
    0,
    0,
    0,
    2000000,
    'Sitio Forte, Ilha Grande, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3327',
    'Casa de Condomínio em Ilha Grande',
    'Ref: 3327. Proprietário: miriam. Telefone:  +5524999949992',
    'casa',
    'venda',
    18000000,
    6,
    7,
    0,
    2200,
    'ILHA DO CAVACO, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8510',
    'Casa em Ilha Grande',
    'Ref: 8510. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    6500000,
    6,
    5,
    0,
    3400,
    'ILHA DA GIPOIA, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6045',
    'Terreno em Ilha Grande',
    'Ref: 6045. Proprietário: Elisa German. Telefone:  +5531985757886',
    'terreno',
    'venda',
    3500000,
    0,
    0,
    0,
    160000,
    'Terreno (praia do Bicão), ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1905',
    'Pousada em Ilha Grande',
    'Ref: 1905. Proprietário: Lu dantas. Telefone:  +5524999750118',
    'casa',
    'venda',
    2500000,
    5,
    7,
    0,
    644,
    'praia, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3022',
    'Terreno em Ilha Grande',
    'Ref: 3022. Proprietário: Matheus Castro da Costa. Telefone:  +5547991329386',
    'terreno',
    'venda',
    8000000,
    0,
    0,
    0,
    68250,
    'Praia dos Marques, 000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1870',
    'Pousada em Ilha Grande',
    'Ref: 1870. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    14000000,
    22,
    22,
    0,
    1028,
    '23°08''41.5"S 44°08''23.3", 00000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8585',
    'Casa em Ilha Grande',
    'Ref: 8585. Proprietário: Joao Roberto. Telefone:  +5521995315168',
    'casa',
    'venda',
    3000000,
    6,
    6,
    0,
    8000,
    'Ilha do Cavaco, 00',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8949',
    'Casa em Ilha Grande',
    'Ref: 8949. Proprietário: Clemente Casa Ikha Gipoia. Telefone:  +5521995662999',
    'casa',
    'venda',
    3450000,
    4,
    4,
    0,
    2100,
    'ilha da Gipóia, 000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4047',
    'Casa em Ilha Grande',
    'Ref: 4047. Proprietário: Gustavo Nogueira. Telefone:  +5531991987458',
    'casa',
    'venda',
    70000000,
    14,
    16,
    0,
    11000,
    'Rodovia Procurador Haroldo Fernandes Duarte, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9325',
    'Casa em Ilha Grande',
    'Ref: 9325. Proprietário: Ana Paula Hulsmeyer. Telefone:  +5521982176513',
    'casa',
    'venda',
    40000000,
    8,
    10,
    5,
    20000,
    'Ilha da Gipoia, oooo',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2006',
    'Casa em Ilha Grande',
    'Ref: 2006. Proprietário: Dirceu. Telefone:  +5511983840303',
    'casa',
    'venda',
    24000000,
    7,
    8,
    0,
    20000,
    'ILHA DO CAVACO, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2277',
    'Casa em Ilha Grande',
    'Ref: 2277. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    29999000,
    12,
    20,
    0,
    23000,
    'Ilha da Gipoia, 00000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '2777',
    'Casa em Ilha Grande',
    'Ref: 2777. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    30000000,
    12,
    20,
    0,
    23000,
    'Ilha da Gipoia, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1240',
    'Casa em Ilha Grande',
    'Ref: 1240. Proprietário: andré Raduan Cliente dr Rafael Casa Ilha Grande. Telefone:  +5511975426748',
    'casa',
    'venda',
    7000000,
    4,
    5,
    0,
    28925,
    '000000, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5211',
    'Casa em Ilha Grande',
    'Ref: 5211. Proprietário: Rosa Paula. Telefone:  +5511955521533',
    'casa',
    'aluguel',
    29640000,
    10,
    3,
    0,
    1216,
    'Ilha das Palmeiras, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '7312',
    'Casa em Ilha Grande',
    'Ref: 7312. Proprietário: MIRIAM NOVAES. Telefone:  +5524998171579',
    'casa',
    'venda',
    70000000,
    11,
    10,
    0,
    340000,
    'Ilha da Gipóia, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '1505',
    'Casa em Ilha Grande',
    'Ref: 1505. Proprietário: Mario Cavaco 40 milhoes. Telefone:  +5511999848481',
    'casa',
    'venda',
    65000000,
    7,
    9,
    0,
    340000,
    'ILHA DO CAVACO, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6456',
    'Casa em Ilha Grande',
    'Ref: 6456. Proprietário: Mario Cavaco 40 milhoes. Telefone:  +5511999848481',
    'casa',
    'venda',
    65000000,
    7,
    9,
    0,
    340000,
    'ILHA DO CAVACO, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4223',
    'Casa em Ilha Grande',
    'Ref: 4223. Proprietário: Beatrice. Telefone:  +5521986452327',
    'casa',
    'venda',
    6000000,
    4,
    5,
    0,
    340000,
    'Ilha da gipoia, 01',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '165',
    'Casa em Ilha Grande',
    'Ref: 165. Proprietário: Mônica Santana. Telefone:  +5521981560086',
    'casa',
    'venda',
    0,
    7,
    8,
    0,
    340000,
    'Ilha do Algodao, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5120',
    'Pousada em Ilha Grande',
    'Ref: 5120. Proprietário: Tânia Roberta Azevedo. Telefone:  +5521995243070',
    'casa',
    'venda',
    7000000,
    20,
    22,
    0,
    288000,
    'Palmas, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4897',
    'Casa em Ilha Grande',
    'Ref: 4897. Proprietário: Filipe Ilha Sundara. Telefone:  +5521964593180',
    'casa',
    'venda',
    29999000,
    9,
    11,
    0,
    10000,
    'Ilha Sundara, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '057',
    'Casa em Ilha Grande',
    'Ref: 057. Proprietário: George. Telefone:  +5521982998297',
    'casa',
    'venda',
    15000000,
    4,
    2,
    0,
    700,
    'ILHA DOS DESEJOS, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6913',
    'Casa em Ilha Grande',
    'Ref: 6913. Proprietário: Natalie Prop. Casa Saco do Céu. Telefone:  +33607230703',
    'casa',
    'venda',
    27000000,
    5,
    6,
    0,
    6000,
    'Saco do céu, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4116',
    'Casa em Ilha Grande',
    'Ref: 4116. Proprietário: Carlos Eduardo Casa Ilha Das Palmeiras. Telefone:  +5511999063224',
    'casa',
    'venda',
    5000000,
    7,
    8,
    0,
    6000,
    'Ilha das Palmeiras, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '5323',
    'Terreno em Ilha Grande',
    'Ref: 5323. Proprietário: Marco Lanzetti. Telefone:  +5521982676385',
    'terreno',
    'venda',
    10000000,
    2,
    3,
    0,
    12940,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9085',
    'Terreno em Ilha Grande',
    'Ref: 9085. Proprietário: Marco Lanzetti. Telefone:  +5521982676385',
    'terreno',
    'venda',
    15000000,
    2,
    3,
    0,
    20000,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9264',
    'Terreno em Ilha Grande',
    'Ref: 9264. Proprietário: Marco Lanzetti. Telefone:  +5521982676385',
    'terreno',
    'venda',
    6000000,
    2,
    3,
    0,
    7252,
    'Rodovia Procurador Haroldo Fernandes Duarte, 1',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '9902',
    'Casa em Ilha Grande',
    'Ref: 9902. Proprietário: Monserrat Prop. Ilha do Maná. Telefone:  +5511999834041',
    'casa',
    'venda',
    22000000,
    5,
    5,
    0,
    62499.98,
    'Ilha do Maná, 0000',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8984',
    'Casa em Ilha Grande',
    'Ref: 8984. Proprietário: Carol Nino. Telefone:  +5521964474628',
    'casa',
    'venda',
    0,
    12,
    13,
    0,
    62499.98,
    'Praia da Jáca, 00',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '8020',
    'Casa em Ilha Grande',
    'Ref: 8020. Proprietário: Regina Abraao. Telefone:  +16475339940',
    'casa',
    'venda',
    5500000,
    5,
    5,
    0,
    250,
    'Abraão, Ilha Grande, 77',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '3993',
    'Casa em Ilha Grande',
    'Ref: 3993. Proprietário: Zio Casa grega. Telefone:  +5511949494409',
    'casa',
    'venda',
    5500000,
    3,
    3,
    0,
    300,
    'ILHA DO CAVACO, ',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '4794',
    'Casa em Ilha Grande',
    'Ref: 4794. Proprietário: Flavia Filha da Proprietaria. Telefone:  +5521995306767',
    'casa',
    'venda',
    6500000,
    5,
    6,
    0,
    17155,
    'ILHA DA GIPÓIA, 00',
    'Ilha Grande',
    'Angra dos Reis',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
  INSERT INTO public.properties (
    company_id, internal_id, title, description, property_type, transaction_type, 
    price, bedrooms, bathrooms, parking_spots, area_total, 
    address, neighborhood, city, state, status, is_published
  ) VALUES (
    v_company_id,
    '6797',
    'Casa em Conceição de Jacareí',
    'Ref: 6797. Proprietário: Barbara Esposa do Sandro. Telefone:  +5521965002118',
    'casa',
    'venda',
    8000000,
    6,
    7,
    6,
    17155,
    'Condomínio Portobello, 3',
    'Conceição de Jacareí',
    'Mangaratiba',
    'RJ',
    'disponivel',
    true
  ) ON CONFLICT DO NOTHING;
  
END $$;