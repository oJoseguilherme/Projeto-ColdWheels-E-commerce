-- Migration V1.1: Tornar quantidade_pecas e ano_lancamento anuláveis na tabela pista
-- Motivo: Adequação ao catálogo real onde fabricantes (como a Mattel) não fornecem
-- contagem de peças de montagem nem ano de lançamento individual para todos os modelos.

ALTER TABLE pista ALTER COLUMN quantidade_pecas DROP NOT NULL;
ALTER TABLE pista ALTER COLUMN ano_lancamento DROP NOT NULL;
