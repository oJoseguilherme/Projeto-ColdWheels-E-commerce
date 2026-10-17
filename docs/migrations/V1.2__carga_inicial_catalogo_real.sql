-- ======================================================================================
-- ColdWheels — Migration V1.2: Carga Inicial do Catálogo Real e Dados Relacionados
-- ======================================================================================

BEGIN;

-- 1. Remoção controlada dos pedidos de demonstração e seus itens (não representam vendas reais)
DELETE FROM item_pedido;
DELETE FROM pedido;

-- 2. Remoção dos carrinhos e pistas fictícios de demonstração
DELETE FROM carrinho;
DELETE FROM pista;

-- 3. Garantir Categorias Oficiais
INSERT INTO categoria (nome, descricao, data_cadastro) VALUES
('Superesportivos', 'Miniaturas de carros de alta performance e exoticos', NOW()),
('Muscle Cars', 'Potentes classicos e modernos muscle cars americanos', NOW()),
('Classicos Vintage', 'Carros classicos e historicos que marcaram epoca', NOW()),
('Off-Road e Picapes', 'Veiculos todo-terreno, SUVs, 4x4 e picapes', NOW()),
('Corrida e Competicao', 'Modelos de pista, Formula 1, GT e fantasy cars', NOW())
ON CONFLICT (nome) DO NOTHING;

-- 4. Garantir Marcas Oficiais
INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Hot Wheels (Mattel)', 'Estados Unidos', '🇺🇸', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hot_Wheels_logo.svg/640px-Hot_Wheels_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Hot Wheels (Mattel)');

INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Matchbox', 'Reino Unido', '🇬🇧', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Matchbox_logo.svg/640px-Matchbox_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Matchbox');

INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Majorette', 'França', '🇫🇷', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Majorette_logo.svg/640px-Majorette_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Majorette');

INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Tomica (Takara Tomy)', 'Japão', '🇯🇵', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tomica_logo.svg/640px-Tomica_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Tomica (Takara Tomy)');

INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Greenlight Collectibles', 'Estados Unidos', '🇺🇸', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Greenlight_Collectibles_logo.svg/640px-Greenlight_Collectibles_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Greenlight Collectibles');

INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'Siku', 'Alemanha', '🇩🇪', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Siku_logo.svg/640px-Siku_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'Siku');

-- 5. Inserção dos 10 Carrinhos Reais do Catálogo Oficial
-- 1) Ferrari Testarossa (JKF00)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture Ferrari Testarossa',
    'Ref: JKF00 | Miniatura die-cast premium com chassi e carroceria Metal/Metal e pneus de borracha Real Riders sob licença oficial da Ferrari.',
    '1:64',
    NULL,
    'Rosso Corsa (Vermelho)',
    45.00,
    15,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Superesportivos' AND m.nome = 'Hot Wheels (Mattel)';

-- 2) Pininfarina Battista (JBK77)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture EuroSpeed Automobili Pininfarina Battista',
    'Ref: JBK77 | Superesportivo elétrico italiano da linha Car Culture EuroSpeed em miniatura die-cast premium com rodas Real Riders.',
    '1:64',
    NULL,
    'Azul Metálico',
    45.00,
    12,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Superesportivos' AND m.nome = 'Hot Wheels (Mattel)';

-- 3) RWB Porsche 930 (JJY69)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels RLC Exclusive RWB Porsche 930',
    'Ref: JJY69 | Edição especial para colecionadores Red Line Club do clássico Porsche 930 customizado com o kit widebody Rauh-Welt Begriff.',
    '1:64',
    NULL,
    'Branco / Azul RWB',
    49.90,
    8,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Superesportivos' AND m.nome = 'Hot Wheels (Mattel)';

-- 4) '84 Mustang SVO (JKF31)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture ''84 Mustang SVO',
    'Ref: JKF31 | Clássico esportivo americano dos anos 80 da linha Power Trip mix com motorização turbo e rodas Real Riders.',
    '1:64',
    NULL,
    'Preto Fosco / Grafite',
    39.90,
    18,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Muscle Cars' AND m.nome = 'Hot Wheels (Mattel)';

-- 5) BMW M3 (JKF30)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture BMW M3',
    'Ref: JKF30 | Modelo esportivo de alta performance da série Car Culture Power Trip com rodas esportivas Real Riders e acabamento premium.',
    '1:64',
    NULL,
    'Azul Estoril',
    42.50,
    14,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Muscle Cars' AND m.nome = 'Hot Wheels (Mattel)';

-- 6) Lancia Stratos (JKF26)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture Lancia Stratos',
    'Ref: JKF26 | Ícone do campeonato mundial de rali dos anos 70 da linha Vintage Racing com design de cunha e pneus Real Riders.',
    '1:64',
    NULL,
    'Verde / Branco Rally',
    44.90,
    10,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Classicos Vintage' AND m.nome = 'Hot Wheels (Mattel)';

-- 7) 1965 Shelby Cobra 427 S/C (JJY67)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels RLC Exclusive 1965 Shelby Cobra 427 S/C',
    'Ref: JJY67 | Roadster clássico com motor V8 427 em edição limitada para colecionadores RLC com abertura de capô e acabamento Spectraflame.',
    '1:64',
    NULL,
    'Azul Guarda com Faixas Brancas',
    49.90,
    6,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Classicos Vintage' AND m.nome = 'Hot Wheels (Mattel)';

-- 8) Meyers Manx (JBL22)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Boulevard Meyers Manx',
    'Ref: JBL22 | O clássico buggy todo-terreno que dominou as dunas californianas, em edição premium Boulevard com pneus Real Riders off-road.',
    '1:64',
    NULL,
    'Amarelo Duna',
    39.90,
    16,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Off-Road e Picapes' AND m.nome = 'Hot Wheels (Mattel)';

-- 9) Toyota Land Cruiser (JBK52)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Car Culture Toyota Land Cruiser',
    'Ref: JBK52 | Veículo todo-terreno lendário 4x4 da linha Car Culture com suspensão elevada e chassi e carroceria Metal/Metal.',
    '1:64',
    NULL,
    'Bege Trilha',
    42.00,
    12,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Off-Road e Picapes' AND m.nome = 'Hot Wheels (Mattel)';

-- 10) Mustang RTR Spec 5-FD (JBK48)
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Premium Car Culture 2024 Mustang RTR Spec 5-FD',
    'Ref: JBK48 | Carro oficial da Formula Drift desenvolvido pela equipe RTR Vehicles com pacote aerodinâmico e pintura de corrida.',
    '1:64',
    NULL,
    'Cinza Nardo com Grafismos',
    45.00,
    20,
    c.id,
    m.id,
    NOW()
FROM categoria c, marca m
WHERE c.nome = 'Corrida e Competicao' AND m.nome = 'Hot Wheels (Mattel)';

-- 6. Inserção das 5 Pistas Reais do Catálogo Oficial (com quantidade_pecas = NULL e ano quando desconhecido)
-- 1) Pista de Acrobacias Lança e Bate (JHK73)
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Action Pista de Brinquedo Pista de Acrobacias Lança e Bate',
    'Ref: JHK73 | Pista de acrobacias da linha Hot Wheels Action com lançador de propulsão rápida, zona de colisão ajustável e 1 carrinho em escala 1:64 incluso.',
    299.90,
    NULL,
    NULL,
    4,
    'Hot Wheels Action',
    8,
    m.id,
    NOW()
FROM marca m WHERE m.nome = 'Hot Wheels (Mattel)';

-- 2) Super Lançamento (JHK75)
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Action Pista de Brinquedo Super Lançamento',
    'Ref: JHK75 | Circuito de velocidade da linha Hot Wheels Action com propulsor ajustável, curva de aceleração contínua e 1 veículo 1:64 incluso.',
    199.90,
    NULL,
    NULL,
    4,
    'Hot Wheels Action',
    12,
    m.id,
    NOW()
FROM marca m WHERE m.nome = 'Hot Wheels (Mattel)';

-- 3) Campeonato de Loop (GTV13)
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Action Pista de Brinquedo Campeonato de Loop',
    'Ref: GTV13 | Pista acrobática com looping duplo de alta velocidade da linha Hot Wheels Action, acionamento por lançador de impacto e 1 veículo Hot Wheels incluso.',
    149.90,
    NULL,
    NULL,
    4,
    'Hot Wheels Action',
    15,
    m.id,
    NOW()
FROM marca m WHERE m.nome = 'Hot Wheels (Mattel)';

-- 4) Sprint (JDY15)
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 
    'Hot Wheels Racing Pista de Brinquedo Sprint',
    'Ref: JDY15 | Mega conjunto de corrida lado a lado da linha Hot Wheels Racing com retas extensas, curvas inclinadas e bandeira de chegada automática.',
    499.00,
    NULL,
    NULL,
    4,
    'Hot Wheels Racing',
    5,
    m.id,
    NOW()
FROM marca m WHERE m.nome = 'Hot Wheels (Mattel)';

-- 5) Desafio do Equilíbrio STEAM (HDY48)
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 
    'Hot Wheels STEAM Balance Shift Playset (Desafio do Equilíbrio)',
    'Ref: HDY48 | Conjunto educativo interativo da linha Hot Wheels STEAM com gangorra de equilíbrio de precisão, lançador duplo integrado e 1 veículo incluso.',
    179.90,
    2021,
    NULL,
    6,
    'Hot Wheels STEAM / Action',
    10,
    m.id,
    NOW()
FROM marca m WHERE m.nome = 'Hot Wheels (Mattel)';

-- 7. Fornecedores e Vínculos com Marcas
INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Mattel do Brasil Distribuição e Brinquedos Ltda', 'Mattel Brasil Die-Cast', '54.557.712/0001-39', 'Rodrigo Siqueira (Gerente de Contas)', 'comercial.brasil@mattel.com', '(11) 3045-8800', 'São Paulo', 'SP', 4, 'ATIVO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '54.557.712/0001-39');

INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Simba Dickie Group Brasil Importadora S.A.', 'Majorette Brasil Distribution', '28.144.590/0001-62', 'Camila Vasconcelos', 'vendas@majorette.com.br', '(41) 3321-4500', 'Curitiba', 'PR', 6, 'ATIVO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '28.144.590/0001-62');

INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Tomica Asia Imports & Logistics Amazônia Ltda', 'Tomica Brasil Hub', '03.892.411/0002-18', 'Takeshi Yamada', 'contato@tomicaimports.com.br', '(92) 3614-2200', 'Manaus', 'AM', 9, 'ATIVO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '03.892.411/0002-18');

INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Greenlight Collectibles Brasil Distribuidora Ltda', 'Greenlight Die-Cast Express', '19.456.782/0001-44', 'Marcos Vinícius Prado', 'atendimento@greenlightbrasil.com', '(21) 2589-3300', 'Rio de Janeiro', 'RJ', 5, 'ATIVO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '19.456.782/0001-44');

INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Track & Racing Circuit Dynamics do Brasil Ltda', 'Apex Track Systems', '33.987.123/0001-05', 'Larissa Esteves', 'pedidos@apextracks.com.br', '(31) 3277-9000', 'Belo Horizonte', 'MG', 7, 'ATIVO', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '33.987.123/0001-05');

INSERT INTO fornecedor (razao_social, nome_fantasia, cnpj, contato_nome, email, telefone, cidade, uf, prazo_entrega_dias, status, data_cadastro)
SELECT 'Southern Cast & Miniatures Logística Ltda', 'M2 Southern Supply', '11.234.890/0001-88', 'Fernando Zanetti', 'comercial@southerncast.com.br', '(51) 3344-5500', 'Porto Alegre', 'RS', 8, 'EM_ANALISE', NOW()
WHERE NOT EXISTS (SELECT 1 FROM fornecedor WHERE cnpj = '11.234.890/0001-88');

-- Vínculo Fornecedor x Marca
INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '54.557.712/0001-39' AND m.nome IN ('Hot Wheels (Mattel)', 'Matchbox')
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '28.144.590/0001-62' AND m.nome = 'Majorette'
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '03.892.411/0002-18' AND m.nome = 'Tomica (Takara Tomy)'
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '19.456.782/0001-44' AND m.nome = 'Greenlight Collectibles'
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '33.987.123/0001-05' AND m.nome IN ('Hot Wheels (Mattel)', 'Matchbox')
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '11.234.890/0001-88' AND m.nome IN ('Siku', 'Greenlight Collectibles')
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

-- 8. Recriação dos Pedidos Demonstrativos Apontando para o Catálogo Real
INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro) VALUES
('CW-1090', 'PAGO', NOW() - INTERVAL '1 DAY', NOW()),
('CW-1089', 'ENVIADO', NOW() - INTERVAL '2 DAYS', NOW()),
('CW-1088', 'PENDENTE', NOW() - INTERVAL '3 DAYS', NOW()),
('CW-1087', 'ENTREGUE', NOW() - INTERVAL '4 DAYS', NOW()),
('CW-1086', 'CANCELADO', NOW() - INTERVAL '5 DAYS', NOW());

-- 9. Itens de Pedido Referenciando Produtos Reais
-- Pedido CW-1090: 2x Ferrari Testarossa e 1x BMW M3
INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 2, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1090' AND c.nome = 'Hot Wheels Premium Car Culture Ferrari Testarossa';

INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 1, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1090' AND c.nome = 'Hot Wheels Premium Car Culture BMW M3';

-- Pedido CW-1089: 1x Pista Campeonato de Loop
INSERT INTO item_pedido (id_pedido, id_pista, quantidade, preco_unitario, data_cadastro)
SELECT p.id, trk.id, 1, trk.preco, NOW()
FROM pedido p, pista trk
WHERE p.numero_pedido = 'CW-1089' AND trk.nome = 'Hot Wheels Action Pista de Brinquedo Campeonato de Loop';

-- Pedido CW-1088: 1x Shelby Cobra 427 S/C
INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 1, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1088' AND c.nome = 'Hot Wheels RLC Exclusive 1965 Shelby Cobra 427 S/C';

COMMIT;
