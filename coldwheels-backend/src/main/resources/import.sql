-- ======================================================================================
-- ColdWheels — import.sql: Catálogo Real e Dados Relacionados
-- ======================================================================================

-- 0. Sincronização e transição de Hot Wheels -> ColdWheels em bancos existentes
UPDATE marca SET nome = 'ColdWheels (Mattel)' WHERE nome = 'Hot Wheels (Mattel)';
UPDATE carrinho SET nome = REPLACE(nome, 'Hot Wheels', 'ColdWheels'), descricao = REPLACE(descricao, 'Hot Wheels', 'ColdWheels') WHERE nome LIKE 'Hot Wheels%' OR descricao LIKE '%Hot Wheels%';
UPDATE pista SET nome = REPLACE(nome, 'Hot Wheels', 'ColdWheels'), descricao = REPLACE(descricao, 'Hot Wheels', 'ColdWheels'), colecao = REPLACE(colecao, 'Hot Wheels', 'ColdWheels') WHERE nome LIKE 'Hot Wheels%' OR descricao LIKE '%Hot Wheels%' OR colecao LIKE '%Hot Wheels%';

-- 1. Categorias Oficiais
INSERT INTO categoria (nome, descricao, data_cadastro) VALUES
('Superesportivos', 'Miniaturas de carros de alta performance e exoticos', NOW()),
('Muscle Cars', 'Potentes classicos e modernos muscle cars americanos', NOW()),
('Classicos Vintage', 'Carros classicos e historicos que marcaram epoca', NOW()),
('Off-Road e Picapes', 'Veiculos todo-terreno, SUVs, 4x4 e picapes', NOW()),
('Corrida e Competicao', 'Modelos de pista, Formula 1, GT e fantasy cars', NOW())
ON CONFLICT (nome) DO NOTHING;

-- 2. Marcas Oficiais
INSERT INTO marca (nome, pais_origem, bandeira_pais, logo_url, status, data_cadastro)
SELECT 'ColdWheels (Mattel)', 'Estados Unidos', '🇺🇸', 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Hot_Wheels_logo.svg/640px-Hot_Wheels_logo.svg.png', 'ATIVA', NOW()
WHERE NOT EXISTS (SELECT 1 FROM marca WHERE nome = 'ColdWheels (Mattel)');

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

-- 3. 10 Carrinhos Reais do Catálogo Oficial
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture Ferrari Testarossa', 'Ref: JKF00 | Miniatura die-cast premium com chassi e carroceria Metal/Metal e pneus de borracha Real Riders sob licença oficial da Ferrari.', '1:64', NULL, 'Rosso Corsa (Vermelho)', 45.00, 15, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Superesportivos' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture Ferrari Testarossa');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture EuroSpeed Automobili Pininfarina Battista', 'Ref: JBK77 | Superesportivo elétrico italiano da linha Car Culture EuroSpeed em miniatura die-cast premium com rodas Real Riders.', '1:64', NULL, 'Azul Metálico', 45.00, 12, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Superesportivos' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture EuroSpeed Automobili Pininfarina Battista');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels RLC Exclusive RWB Porsche 930', 'Ref: JJY69 | Edição especial para colecionadores Red Line Club do clássico Porsche 930 customizado com o kit widebody Rauh-Welt Begriff.', '1:64', NULL, 'Branco / Azul RWB', 49.90, 8, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Superesportivos' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels RLC Exclusive RWB Porsche 930');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture ''84 Mustang SVO', 'Ref: JKF31 | Clássico esportivo americano dos anos 80 da linha Power Trip mix com motorização turbo e rodas Real Riders.', '1:64', NULL, 'Preto Fosco / Grafite', 39.90, 18, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Muscle Cars' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture ''84 Mustang SVO');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture BMW M3', 'Ref: JKF30 | Modelo esportivo de alta performance da série Car Culture Power Trip com rodas esportivas Real Riders e acabamento premium.', '1:64', NULL, 'Azul Estoril', 42.50, 14, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Muscle Cars' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture BMW M3');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture Lancia Stratos', 'Ref: JKF26 | Ícone do campeonato mundial de rali dos anos 70 da linha Vintage Racing com design de cunha e pneus Real Riders.', '1:64', NULL, 'Verde / Branco Rally', 44.90, 10, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Classicos Vintage' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture Lancia Stratos');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels RLC Exclusive 1965 Shelby Cobra 427 S/C', 'Ref: JJY67 | Roadster clássico com motor V8 427 em edição limitada para colecionadores RLC com abertura de capô e acabamento Spectraflame.', '1:64', NULL, 'Azul Guarda com Faixas Brancas', 49.90, 6, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Classicos Vintage' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels RLC Exclusive 1965 Shelby Cobra 427 S/C');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Boulevard Meyers Manx', 'Ref: JBL22 | O clássico buggy todo-terreno que dominou as dunas californianas, em edição premium Boulevard com pneus Real Riders off-road.', '1:64', NULL, 'Amarelo Duna', 39.90, 16, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Off-Road e Picapes' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Boulevard Meyers Manx');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Car Culture Toyota Land Cruiser', 'Ref: JBK52 | Veículo todo-terreno lendário 4x4 da linha Car Culture com suspensão elevada e chassi e carroceria Metal/Metal.', '1:64', NULL, 'Bege Trilha', 42.00, 12, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Off-Road e Picapes' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Car Culture Toyota Land Cruiser');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, id_marca, data_cadastro)
SELECT 'ColdWheels Premium Car Culture 2024 Mustang RTR Spec 5-FD', 'Ref: JBK48 | Carro oficial da Formula Drift desenvolvido pela equipe RTR Vehicles com pacote aerodinâmico e pintura de corrida.', '1:64', NULL, 'Cinza Nardo com Grafismos', 45.00, 20, c.id, m.id, NOW()
FROM categoria c, marca m WHERE c.nome = 'Corrida e Competicao' AND m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'ColdWheels Premium Car Culture 2024 Mustang RTR Spec 5-FD');

-- 4. 5 Pistas Reais do Catálogo Oficial
INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 'ColdWheels Action Pista de Brinquedo Pista de Acrobacias Lança e Bate', 'Ref: JHK73 | Pista de acrobacias da linha ColdWheels Action com lançador de propulsão rápida, zona de colisão ajustável e 1 carrinho em escala 1:64 incluso.', 299.90, NULL, NULL, 4, 'ColdWheels Action', 8, m.id, NOW()
FROM marca m WHERE m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM pista WHERE nome = 'ColdWheels Action Pista de Brinquedo Pista de Acrobacias Lança e Bate');

INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 'ColdWheels Action Pista de Brinquedo Super Lançamento', 'Ref: JHK75 | Circuito de velocidade da linha ColdWheels Action com propulsor ajustável, curva de aceleração contínua e 1 veículo 1:64 incluso.', 199.90, NULL, NULL, 4, 'ColdWheels Action', 12, m.id, NOW()
FROM marca m WHERE m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM pista WHERE nome = 'ColdWheels Action Pista de Brinquedo Super Lançamento');

INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 'ColdWheels Action Pista de Brinquedo Campeonato de Loop', 'Ref: GTV13 | Pista acrobática com looping duplo de alta velocidade da linha ColdWheels Action, acionamento por lançador de impacto e 1 veículo ColdWheels incluso.', 149.90, NULL, NULL, 4, 'ColdWheels Action', 15, m.id, NOW()
FROM marca m WHERE m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM pista WHERE nome = 'ColdWheels Action Pista de Brinquedo Campeonato de Loop');

INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 'ColdWheels Racing Pista de Brinquedo Sprint', 'Ref: JDY15 | Mega conjunto de corrida lado a lado da linha ColdWheels Racing com retas extensas, curvas inclinadas e bandeira de chegada automática.', 499.00, NULL, NULL, 4, 'ColdWheels Racing', 5, m.id, NOW()
FROM marca m WHERE m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM pista WHERE nome = 'ColdWheels Racing Pista de Brinquedo Sprint');

INSERT INTO pista (nome, descricao, preco, ano_lancamento, quantidade_pecas, idade_minima, colecao, estoque, id_marca, data_cadastro)
SELECT 'ColdWheels STEAM Balance Shift Playset (Desafio do Equilíbrio)', 'Ref: HDY48 | Conjunto educativo interativo da linha ColdWheels STEAM com gangorra de equilíbrio de precisão, lançador duplo integrado e 1 veículo incluso.', 179.90, 2021, NULL, 6, 'ColdWheels STEAM / Action', 10, m.id, NOW()
FROM marca m WHERE m.nome = 'ColdWheels (Mattel)'
AND NOT EXISTS (SELECT 1 FROM pista WHERE nome = 'ColdWheels STEAM Balance Shift Playset (Desafio do Equilíbrio)');

-- 5. Fornecedores Oficiais
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
WHERE f.cnpj = '54.557.712/0001-39' AND m.nome IN ('ColdWheels (Mattel)', 'Matchbox')
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
WHERE f.cnpj = '33.987.123/0001-05' AND m.nome IN ('ColdWheels (Mattel)', 'Matchbox')
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

INSERT INTO fornecedor_marca (id_fornecedor, id_marca)
SELECT f.id, m.id FROM fornecedor f, marca m
WHERE f.cnpj = '11.234.890/0001-88' AND m.nome IN ('Siku', 'Greenlight Collectibles')
AND NOT EXISTS (SELECT 1 FROM fornecedor_marca fm WHERE fm.id_fornecedor = f.id AND fm.id_marca = m.id);

-- 6. Pedidos Demonstrativos Apontando para o Catálogo Real
INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro)
SELECT 'CW-1090', 'PAGO', NOW() - INTERVAL '1 DAY', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE numero_pedido = 'CW-1090');

INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro)
SELECT 'CW-1089', 'ENVIADO', NOW() - INTERVAL '2 DAYS', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE numero_pedido = 'CW-1089');

INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro)
SELECT 'CW-1088', 'PENDENTE', NOW() - INTERVAL '3 DAYS', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE numero_pedido = 'CW-1088');

INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro)
SELECT 'CW-1087', 'ENTREGUE', NOW() - INTERVAL '4 DAYS', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE numero_pedido = 'CW-1087');

INSERT INTO pedido (numero_pedido, status, data_pedido, data_cadastro)
SELECT 'CW-1086', 'CANCELADO', NOW() - INTERVAL '5 DAYS', NOW()
WHERE NOT EXISTS (SELECT 1 FROM pedido WHERE numero_pedido = 'CW-1086');

-- 7. Itens de Pedido Referenciando Produtos Reais
INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 2, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1090' AND c.nome = 'ColdWheels Premium Car Culture Ferrari Testarossa'
AND NOT EXISTS (SELECT 1 FROM item_pedido ip WHERE ip.id_pedido = p.id AND ip.id_carrinho = c.id);

INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 1, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1090' AND c.nome = 'ColdWheels Premium Car Culture BMW M3'
AND NOT EXISTS (SELECT 1 FROM item_pedido ip WHERE ip.id_pedido = p.id AND ip.id_carrinho = c.id);

INSERT INTO item_pedido (id_pedido, id_pista, quantidade, preco_unitario, data_cadastro)
SELECT p.id, trk.id, 1, trk.preco, NOW()
FROM pedido p, pista trk
WHERE p.numero_pedido = 'CW-1089' AND trk.nome = 'ColdWheels Action Pista de Brinquedo Campeonato de Loop'
AND NOT EXISTS (SELECT 1 FROM item_pedido ip WHERE ip.id_pedido = p.id AND ip.id_pista = trk.id);

INSERT INTO item_pedido (id_pedido, id_carrinho, quantidade, preco_unitario, data_cadastro)
SELECT p.id, c.id, 1, c.preco, NOW()
FROM pedido p, carrinho c
WHERE p.numero_pedido = 'CW-1088' AND c.nome = 'ColdWheels RLC Exclusive 1965 Shelby Cobra 427 S/C'
AND NOT EXISTS (SELECT 1 FROM item_pedido ip WHERE ip.id_pedido = p.id AND ip.id_carrinho = c.id);