$ErrorActionPreference = "Stop"

$baseUrl = "https://servicodados.ibge.gov.br/api/v1/localidades"
$saida = Join-Path $PSScriptRoot "..\..\src\main\resources\data\geografia"

New-Item -ItemType Directory -Force $saida | Out-Null

Write-Host "Consultando Estados no IBGE..."

$estados = Invoke-RestMethod "$baseUrl/estados?orderBy=nome"

$linhasEstados = [System.Collections.Generic.List[string]]::new()
$linhasMunicipios = [System.Collections.Generic.List[string]]::new()

$linhasEstados.Add("codigo_ibge;sigla;nome")
$linhasMunicipios.Add("codigo_ibge;nome;codigo_estado")

foreach ($estado in $estados) {

    if ($estado.nome.Contains(";") -or $estado.sigla.Contains(";")) {
        throw "Caractere ';' inesperado nos dados do Estado $($estado.id)."
    }

    $linhasEstados.Add(
        "$($estado.id);$($estado.sigla);$($estado.nome)"
    )

    Write-Host "Consultando municípios de $($estado.sigla)..."

    $municipios = Invoke-RestMethod `
        "$baseUrl/estados/$($estado.id)/municipios?orderBy=nome"

    foreach ($municipio in $municipios) {

        if ($municipio.nome.Contains(";")) {
            throw "Caractere ';' inesperado no município $($municipio.id)."
        }

        $linhasMunicipios.Add(
            "$($municipio.id);$($municipio.nome);$($estado.id)"
        )
    }
}

$utf8SemBom = New-Object System.Text.UTF8Encoding($false)

[System.IO.File]::WriteAllLines(
    (Join-Path $saida "estados.csv"),
    $linhasEstados,
    $utf8SemBom
)

[System.IO.File]::WriteAllLines(
    (Join-Path $saida "municipios.csv"),
    $linhasMunicipios,
    $utf8SemBom
)

Write-Host ""
Write-Host "Carga geográfica gerada com sucesso."
Write-Host "Estados: $($linhasEstados.Count - 1)"
Write-Host "Municípios: $($linhasMunicipios.Count - 1)"