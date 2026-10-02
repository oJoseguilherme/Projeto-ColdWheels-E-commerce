# Dados geográficos

Esta pasta contém os dados de referência de Estados e Municípios
utilizados pelo ColdWheels.

## Fonte

Os dados são obtidos da API de Localidades do IBGE:

- Estados: `/api/v1/localidades/estados`
- Municípios por Estado: `/api/v1/localidades/estados/{UF}/municipios`

Os códigos armazenados em `codigo_ibge` correspondem aos
identificadores fornecidos pelo IBGE.

## Arquivos

### estados.csv

Campos:

- `codigo_ibge`
- `sigla`
- `nome`

### municipios.csv

Campos:

- `codigo_ibge`
- `nome`
- `codigo_estado`

`codigo_estado` referencia o código IBGE existente em `estados.csv`.

## Atualização

Os arquivos CSV são gerados pelo script:

`gerar-geografia.ps1`

Para atualizar a base, execute o script novamente e revise as
alterações antes de versioná-las.

A aplicação não depende da API do IBGE durante sua execução normal.
Os dados são carregados a partir dos arquivos versionados no projeto.

## Localização dos dados

Os arquivos utilizados pela aplicação ficam em:

`src/main/resources/data/geografia/`

- `estados.csv`
- `municipios.csv`

Esta pasta contém apenas o script responsável pela geração dos
dados e sua documentação.