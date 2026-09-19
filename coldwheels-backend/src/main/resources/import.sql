-- Inserir categorias
INSERT INTO categoria (nome, descricao, data_cadastro) VALUES
('Superesportivos', 'Miniaturas de carros de alta performance e exoticos', NOW()),
('Muscle Cars', 'Potentes classicos e modernos muscle cars americanos', NOW()),
('Classicos Vintage', 'Carros classicos e historicos que marcaram epoca', NOW()),
('Off-Road e Picapes', 'Veiculos todo-terreno, SUVs, 4x4 e picapes', NOW()),
('Corrida e Competicao', 'Modelos de pista, Formula 1, GT e fantasy cars', NOW())
ON CONFLICT (nome) DO NOTHING;

-- Atualizar registros existentes caso id_categoria seja nulo
UPDATE carrinho SET id_categoria = (SELECT id FROM categoria WHERE nome = 'Corrida e Competicao') WHERE id_categoria IS NULL;

-- Inserir carrinhos de exemplo
INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Bugatti Chiron Pur Sport', 'Edicao especial com aerofolio traseiro fixo e detalhes em fibra de carbono.', '1:64', 2024, 'Azul French Racing', 34.90, 15, c.id, NOW()
FROM categoria c WHERE c.nome = 'Superesportivos' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Bugatti Chiron Pur Sport');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Lamborghini Veneno', 'Superesportivo ultra-raro com pintura especial cinza metalica e detalhes vermelhos.', '1:64', 2023, 'Cinza Metalico', 39.90, 8, c.id, NOW()
FROM categoria c WHERE c.nome = 'Superesportivos' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Lamborghini Veneno');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Porsche 911 GT3 RS', 'Aerodinamica agressiva com rodas douradas e aerofolio imponente.', '1:64', 2024, 'Verde Pitao', 42.50, 12, c.id, NOW()
FROM categoria c WHERE c.nome = 'Superesportivos' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Porsche 911 GT3 RS');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Ferrari LaFerrari', 'Icone hibrido italiano com portas asa de gaivota e acabamento premium.', '1:64', 2022, 'Vermelho Corsa', 45.00, 5, c.id, NOW()
FROM categoria c WHERE c.nome = 'Superesportivos' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Ferrari LaFerrari');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT '1969 Dodge Charger R/T', 'Lenda dos Muscle Cars com motor Hemi 426 e faixas esportivas pretas.', '1:64', 2023, 'Laranja Daytona', 29.90, 20, c.id, NOW()
FROM categoria c WHERE c.nome = 'Muscle Cars' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = '1969 Dodge Charger R/T');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT '1967 Ford Mustang Boss 302', 'Classico americano de arrancada com capo preto fosco.', '1:64', 2023, 'Amarelo Grabber', 31.90, 14, c.id, NOW()
FROM categoria c WHERE c.nome = 'Muscle Cars' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = '1967 Ford Mustang Boss 302');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Chevrolet Camaro SS 2024', 'Visual moderno e agressivo com rodas esportivas pretas.', '1:64', 2024, 'Preto Onix', 28.90, 18, c.id, NOW()
FROM categoria c WHERE c.nome = 'Muscle Cars' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Chevrolet Camaro SS 2024');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT '1957 Chevrolet Bel Air', 'O apice dos carros classicos dos anos 50, com barbatanas traseiras cromadas.', '1:64', 2021, 'Turquesa Vintage', 37.90, 7, c.id, NOW()
FROM categoria c WHERE c.nome = 'Classicos Vintage' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = '1957 Chevrolet Bel Air');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Volkswagen Beetle Fusca 1967', 'O classico Fusquinha customizado com teto solar ragtop.', '1:64', 2022, 'Branco Lotus', 26.50, 25, c.id, NOW()
FROM categoria c WHERE c.nome = 'Classicos Vintage' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Volkswagen Beetle Fusca 1967');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Shelby Cobra 427 S/C', 'Roadster lendario com escapamento lateral e faixas de corrida.', '1:64', 2023, 'Azul Guarda com Branco', 44.90, 6, c.id, NOW()
FROM categoria c WHERE c.nome = 'Classicos Vintage' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Shelby Cobra 427 S/C');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Ford F-150 Raptor', 'Picape off-road para altas velocidades no deserto com suspensao reforcada.', '1:64', 2024, 'Cinza Fosco', 33.90, 16, c.id, NOW()
FROM categoria c WHERE c.nome = 'Off-Road e Picapes' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Ford F-150 Raptor');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Jeep Wrangler Rubicon', 'Equipado com guincho dianteiro, pneu lameiro e estepe na traseira.', '1:64', 2023, 'Laranja Trilha', 32.00, 11, c.id, NOW()
FROM categoria c WHERE c.nome = 'Off-Road e Picapes' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Jeep Wrangler Rubicon');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Bone Shaker Special Edition', 'O carro conceito mais famoso da ColdWheels com caveira cromada na frente.', '1:64', 2024, 'Preto Fosco com Chamas', 35.00, 30, c.id, NOW()
FROM categoria c WHERE c.nome = 'Corrida e Competicao' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Bone Shaker Special Edition');

INSERT INTO carrinho (nome, descricao, escala, anolancamento, cor, preco, estoque, id_categoria, data_cadastro)
SELECT 'Twin Mill III', 'Dois motores enormes expostos na dianteira e design futurista.', '1:64', 2024, 'Verde Esmeralda Metalico', 29.90, 22, c.id, NOW()
FROM categoria c WHERE c.nome = 'Corrida e Competicao' AND NOT EXISTS (SELECT 1 FROM carrinho WHERE nome = 'Twin Mill III');