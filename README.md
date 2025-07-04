# Relatório de Testes End-to-End - API Rethink Test Bank (com TypeScript)

Este repositório contém os testes end-to-end automatizados para a API do Rethink Test Bank. Os testes foram desenvolvidos com **Jest** e **TypeScript** para garantir maior robustez, segurança de tipos e manutenibilidade.

O objetivo deste teste é validar se a jornada principal do usuário funciona conforme a documentação oficial e identificar quaisquer bugs ou inconsistências na API. O teste foi projetado para **falhar**, servindo como uma prova automatizada dos bugs listados neste relatório.

## Como Executar os Testes

Para clonar e rodar o projeto de testes, siga os passos abaixo.

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)

### Passos para Execução

1.  **Instale as dependências:**
    Este comando lê o `package.json` e instala todas as ferramentas necessárias para o projeto, incluindo Jest, TypeScript, ts-jest, Axios, etc.

    ```bash
        npm install
    ```

2.  **Execute os testes:**
    O comando abaixo inicia o Jest, que usa o `ts-jest` para compilar e executar os arquivos de teste em TypeScript. O resultado detalhado será exibido no console.
    ```bash
        npm test
    ```

## Análise de Bugs, Criticidade e Prontidão para Produção

Aqui estão as respostas para as perguntas do desafio com base nos resultados dos testes automatizados.

### a. Há bugs? Se sim, quais são e quais são os cenários esperados?

**Sim, foram encontrados 2 bugs críticos** durante a execução dos testes.

#### Bug 1: Endpoint de Envio de Pontos Incorreto (Contrato da API Quebrado)

- **Cenário do Bug:**
  A documentação da API especifica que a transferência de pontos deve ser feita via `POST /points/send`. No entanto, este endpoint retorna um erro **`404 Not Found`**. O teste automatizado neste repositório **prova a existência deste bug**, pois ele chama exatamente este endpoint e falha, conforme esperado.

- **Cenário Esperado:**
  A API deveria seguir o contrato de sua documentação. Uma requisição `POST` para `/points/send` deveria processar a transferência e retornar uma resposta de sucesso com status `200 OK`.

#### Bug 2: Saldo do Usuário Não é Atualizado Após Transações

- **Cenário do Bug:**
  Para aprofundar a investigação, o teste foi temporariamente modificado para usar um endpoint não documentado que foi descoberto (`/transaction/send`). Com essa alteração, foi possível prosseguir na jornada e identificar um segundo bug: após realizar com sucesso uma transferência de 50 pontos e um depósito de 30 pontos, a API informa que o saldo principal (`normal_balance`) do usuário continua sendo 100, quando o valor correto deveria ser 20 (100 - 50 - 30).

- **Cenário Esperado:**
  As transações (envio de pontos e depósitos) devem debitar o valor correspondente do saldo principal do usuário. O endpoint `GET /points/saldo` deve retornar o valor matemático correto do saldo após cada operação.

### b. Se houver bugs, classifique-os em nível de criticidade.

Ambos os bugs são classificados como **Críticos (Critical) / Bloqueadores (Blocker)**.

- **Justificativa (Bug 1):** A quebra do contrato da API (documentação vs. implementação) torna a integração com o sistema não confiável e propensa a erros, bloqueando o desenvolvimento de aplicações cliente.

- **Justificativa (Bug 2):** Esta é uma falha grave na lógica de negócio principal. O sistema permite que os usuários realizem transações sem que o saldo seja debitado, o que pode levar a um "dinheiro infinito" virtual, quebrando completamente o propósito do sistema de pontos.

### c. Diante do cenário, o sistema está pronto para subir em produção?

**Não, em hipótese alguma.**

- **Justificativa:**
  O sistema apresenta falhas críticas em suas funcionalidades mais essenciais. O **Bug 1** demonstra uma falta de governança e cuidado com a API, enquanto o **Bug 2** representa uma falha catastrófica na lógica de negócio que compromete toda a integridade da plataforma. Lançar o sistema neste estado resultaria em uma experiência de usuário quebrada, perda total de confiança e potencial exploração de falhas. É mandatório que ambos os bugs sejam corrigidos e que uma nova rodada completa de testes de regressão (usando este mesmo script) seja executada com sucesso antes de qualquer nova consideração sobre o lançamento em produção.
