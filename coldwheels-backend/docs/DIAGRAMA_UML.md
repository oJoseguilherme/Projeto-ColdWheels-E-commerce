# Diagramas UML - ColdWheels Backend

Este documento reúne os diagramas UML da aplicação **ColdWheels Backend** desenvolvida em Quarkus.

---

## 1. Diagrama de Classes do Domínio (Modelo de Dados)

### Formato Mermaid

```mermaid
classDiagram
    direction TB

    class DefaultEntity {
        <<abstract>>
        +Long id
        +LocalDateTime dataCadastro
        +getId() Long
        +setId(Long id) void
        +getDataCadastro() LocalDateTime
        +setDataCadastro(LocalDateTime dataCadastro) void
        +prePersist() void
    }

    class Pessoa {
        +String nome
        +String cpf
        +String email
        +LocalDate dataNascimento
        +String telefone
        +Endereco endereco
        +getNome() String
        +setNome(String nome) void
        +getCpf() String
        +setCpf(String cpf) void
        +getEmail() String
        +setEmail(String email) void
        +getDataNascimento() LocalDate
        +setDataNascimento(LocalDate dataNascimento) void
        +getTelefone() String
        +setTelefone(String telefone) void
        +getEndereco() Endereco
        +setEndereco(Endereco endereco) void
    }

    class Endereco {
        <<Embeddable>>
        +String cep
        +String logradouro
        +String numero
        +String complemento
        +String bairro
        +Municipio municipio
        +getCep() String
        +setCep(String cep) void
        +getLogradouro() String
        +setLogradouro(String logradouro) void
        +getNumero() String
        +setNumero(String numero) void
        +getComplemento() String
        +setComplemento(String complemento) void
        +getBairro() String
        +setBairro(String bairro) void
        +getMunicipio() Municipio
        +setMunicipio(Municipio municipio) void
    }

    class Municipio {
        +String codigoIbge
        +String nome
        +Estado estado
        +getCodigoIbge() String
        +setCodigoIbge(String codigoIbge) void
        +getNome() String
        +setNome(String nome) void
        +getEstado() Estado
        +setEstado(Estado estado) void
    }

    class Estado {
        +String codigoIbge
        +String nome
        +String sigla
        +getCodigoIbge() String
        +setCodigoIbge(String codigoIbge) void
        +getNome() String
        +setNome(String nome) void
        +getSigla() String
        +setSigla(String sigla) void
    }

    class Cliente {
        +Pessoa pessoa
        +getPessoa() Pessoa
        +setPessoa(Pessoa pessoa) void
    }

    class Categoria {
        +String nome
        +String descricao
        +getNome() String
        +setNome(String nome) void
        +getDescricao() String
        +setDescricao(String descricao) void
    }

    class Carrinho {
        +String nome
        +String descricao
        +String escala
        +Integer anoLancamento
        +String cor
        +Double preco
        +Integer estoque
        +Categoria categoria
        +getNome() String
        +setNome(String nome) void
        +getDescricao() String
        +setDescricao(String descricao) void
        +getEscala() String
        +setEscala(String escala) void
        +getAnoLancamento() Integer
        +setAnoLancamento(Integer anoLancamento) void
        +getCor() String
        +setCor(String cor) void
        +getPreco() Double
        +setPreco(Double preco) void
        +getEstoque() Integer
        +setEstoque(Integer estoque) void
        +getCategoria() Categoria
        +setCategoria(Categoria categoria) void
    }

    class Pista {
        +String nome
        +String descricao
        +BigDecimal preco
        +Integer anoLancamento
        +Integer quantidadePecas
        +Integer idadeMinima
        +String colecao
        +Integer estoque
        +getNome() String
        +setNome(String nome) void
        +getDescricao() String
        +setDescricao(String descricao) void
        +getPreco() BigDecimal
        +setPreco(BigDecimal preco) void
        +getAnoLancamento() Integer
        +setAnoLancamento(Integer anoLancamento) void
        +getQuantidadePecas() Integer
        +setQuantidadePecas(Integer quantidadePecas) void
        +getIdadeMinima() Integer
        +setIdadeMinima(Integer idadeMinima) void
        +getColecao() String
        +setColecao(String colecao) void
        +getEstoque() Integer
        +setEstoque(Integer estoque) void
    }

    %% Heranças
    DefaultEntity <|-- Pessoa
    DefaultEntity <|-- Cliente
    DefaultEntity <|-- Municipio
    DefaultEntity <|-- Estado
    DefaultEntity <|-- Categoria
    DefaultEntity <|-- Carrinho
    DefaultEntity <|-- Pista

    %% Associações e Composições
    Cliente "1" --> "1" Pessoa : 1..1 pessoa
    Pessoa *-- "1" Endereco : embutido
    Endereco --> "1" Municipio : 1..* municipio
    Municipio --> "1" Estado : 1..* estado
    Carrinho --> "0..1" Categoria : 1..* categoria
```

---

### Formato PlantUML

```plantuml
@startuml
skinparam classAttributeIconSize 0

abstract class DefaultEntity {
    - id : Long
    - dataCadastro : LocalDateTime
    + getId() : Long
    + setId(id: Long) : void
    + getDataCadastro() : LocalDateTime
    + setDataCadastro(data: LocalDateTime) : void
    + prePersist() : void
}

class Pessoa {
    - nome : String
    - cpf : String
    - email : String
    - dataNascimento : LocalDate
    - telefone : String
    - endereco : Endereco
    + getNome() : String
    + setNome(nome: String) : void
    + getCpf() : String
    + setCpf(cpf: String) : void
    + getEmail() : String
    + setEmail(email: String) : void
    + getDataNascimento() : LocalDate
    + setDataNascimento(data: LocalDate) : void
    + getTelefone() : String
    + setTelefone(tel: String) : void
    + getEndereco() : Endereco
    + setEndereco(end: Endereco) : void
}

class Endereco <<Embeddable>> {
    - cep : String
    - logradouro : String
    - numero : String
    - complemento : String
    - bairro : String
    - municipio : Municipio
    + getCep() : String
    + setCep(cep: String) : void
    + getLogradouro() : String
    + setLogradouro(logradouro: String) : void
    + getNumero() : String
    + setNumero(num: String) : void
    + getComplemento() : String
    + setComplemento(comp: String) : void
    + getBairro() : String
    + setBairro(bairro: String) : void
    + getMunicipio() : Municipio
    + setMunicipio(mun: Municipio) : void
}

class Municipio {
    - codigoIbge : String
    - nome : String
    - estado : Estado
    + getCodigoIbge() : String
    + setCodigoIbge(cod: String) : void
    + getNome() : String
    + setNome(nome: String) : void
    + getEstado() : Estado
    + setEstado(est: Estado) : void
}

class Estado {
    - codigoIbge : String
    - nome : String
    - sigla : String
    + getCodigoIbge() : String
    + setCodigoIbge(cod: String) : void
    + getNome() : String
    + setNome(nome: String) : void
    + getSigla() : String
    + setSigla(sigla: String) : void
}

class Cliente {
    - pessoa : Pessoa
    + getPessoa() : Pessoa
    + setPessoa(pessoa: Pessoa) : void
}

class Categoria {
    - nome : String
    - descricao : String
    + getNome() : String
    + setNome(nome: String) : void
    + getDescricao() : String
    + setDescricao(desc: String) : void
}

class Carrinho {
    - nome : String
    - descricao : String
    - escala : String
    - anoLancamento : Integer
    - cor : String
    - preco : Double
    - estoque : Integer
    - categoria : Categoria
    + getNome() : String
    + setNome(nome: String) : void
    + getDescricao() : String
    + setDescricao(desc: String) : void
    + getEscala() : String
    + setEscala(escala: String) : void
    + getAnoLancamento() : Integer
    + setAnoLancamento(ano: Integer) : void
    + getCor() : String
    + setCor(cor: String) : void
    + getPreco() : Double
    + setPreco(preco: Double) : void
    + getEstoque() : Integer
    + setEstoque(est: Integer) : void
    + getCategoria() : Categoria
    + setCategoria(cat: Categoria) : void
}

class Pista {
    - nome : String
    - descricao : String
    - preco : BigDecimal
    - anoLancamento : Integer
    - quantidadePecas : Integer
    - idadeMinima : Integer
    - colecao : String
    - estoque : Integer
    + getNome() : String
    + setNome(nome: String) : void
    + getDescricao() : String
    + setDescricao(desc: String) : void
    + getPreco() : BigDecimal
    + setPreco(preco: BigDecimal) : void
    + getAnoLancamento() : Integer
    + setAnoLancamento(ano: Integer) : void
    + getQuantidadePecas() : Integer
    + setQuantidadePecas(qtd: Integer) : void
    + getIdadeMinima() : Integer
    + setIdadeMinima(idade: Integer) : void
    + getColecao() : String
    + setColecao(col: String) : void
    + getEstoque() : Integer
    + setEstoque(est: Integer) : void
}

DefaultEntity <|-- Pessoa
DefaultEntity <|-- Cliente
DefaultEntity <|-- Municipio
DefaultEntity <|-- Estado
DefaultEntity <|-- Categoria
DefaultEntity <|-- Carrinho
DefaultEntity <|-- Pista

Cliente "1" --> "1" Pessoa : pessoa
Pessoa *-- "1" Endereco : endereco
Endereco --> "1" Municipio : municipio
Municipio --> "1" Estado : estado
Carrinho --> "0..1" Categoria : categoria

@enduml
```
