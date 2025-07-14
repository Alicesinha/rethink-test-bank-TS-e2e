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

# Relatório Final de Testes de Qualidade – API Rethink Test Bank

Este documento apresenta os resultados da análise e da execução de testes end-to-end automatizados na API do Rethink Test Bank. A suíte de testes foi desenvolvida utilizando Jest e TypeScript para validar a jornada do usuário e a conformidade da API com as boas práticas de desenvolvimento.

A análise revelou múltiplos bugs, incluindo falhas críticas que comprometem a funcionalidade central do sistema.

---

### a- Há bugs? Se sim, quais são e quais são os cenários esperados?

**Sim, foram encontrados 4 bugs distintos**, variando de falhas de design a erros críticos na lógica de negócio.

#### Bug 1: Endpoint de Envio de Pontos Incorreto (Contrato da API Quebrado)

- **Cenário do Bug:** A documentação oficial especifica que a transferência de pontos deve ocorrer na rota `POST /points/send`. No entanto, qualquer chamada para este endpoint resulta em um erro `404 Not Found`, indicando que a rota não existe.
- **Cenário Esperado:** A API deve implementar e responder na rota `POST /points/send`, conforme especificado em seu contrato (documentação). Uma requisição válida para este endpoint deveria processar a transação e retornar um status `200 OK`.

#### Bug 2: Saldo do Usuário Não é Atualizado Após Transações

- **Cenário do Bug:** Ao utilizar um endpoint alternativo funcional (`/transaction/send`), a API retorna uma mensagem de sucesso para o envio de pontos. Contudo, ao consultar o saldo do usuário em seguida (`GET /points/saldo`), o valor do `normal_balance` permanece inalterado, como se nenhuma transação tivesse ocorrido.
- **Cenário Esperado:** Qualquer transação de débito (envio de pontos, depósito em cofre, etc.) deve ser refletida de forma imediata e precisa no saldo geral do usuário.

#### Bug 3: Uso de Códigos de Status HTTP Inadequados

- **Cenário do Bug:** A API utiliza o código de status genérico `400 Bad Request` para múltiplos cenários de erro distintos, que deveriam ter códigos específicos, como:
  1.  Cadastro com CPF que já existe (retorna `400` em vez de `409 Conflict`).
  2.  Login com um e-mail que não existe na base (retorna `400` em vez de `404 Not Found`).
  3.  Login com um usuário cujo e-mail não foi confirmado (retorna `400` em vez de `401 Unauthorized` ou `403 Forbidden`).
- **Cenário Esperado:** A API deve empregar códigos de status HTTP específicos para cada tipo de erro, seguindo as convenções de APIs RESTful. Isso é fundamental para que os sistemas clientes possam tratar os erros de forma programática e eficiente.

#### Bug 4: Falha Inconsistente no Cadastro de Usuários

- **Cenário do Bug:** O endpoint `POST /cadastro` frequentemente retorna `400 Bad Request` mesmo quando os dados enviados parecem atender a todos os critérios de validação documentados (formato de CPF, força da senha, etc.). Isso torna o ponto de entrada principal do sistema instável e imprevisível.
- **Cenário Esperado:** O endpoint de cadastro deve retornar `201 Created` de forma consistente sempre que os dados da requisição forem válidos, ou retornar um erro `400` com uma mensagem clara especificando qual campo falhou na validação.

---

### b- Se houver bugs, classifique-os em nível de criticidade.

| Bug | Título                        | Criticidade              | Justificativa                                                                                                       |
| :-- | :---------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------ |
| #1  | Endpoint Incorreto            | **Crítico / Bloqueador** | Impede a execução da funcionalidade principal conforme o contrato. Viola a confiança na documentação.               |
| #2  | Saldo não Atualiza            | **Crítico / Bloqueador** | Falha catastrófica na lógica de negócio. Corrompe a integridade dos dados e o propósito central do sistema.         |
| #3  | Códigos de Status Inadequados | **Médio**                | Não impede o funcionamento, mas indica baixa qualidade técnica, viola as convenções e dificulta a integração.       |
| #4  | Falha no Cadastro             | **Alto**                 | Impede de forma inconsistente que novos usuários entrem no sistema, tornando a aquisição de usuários não confiável. |

---

### c- Diante do cenário, o sistema está pronto para subir em produção?

**Não, em hipótese alguma.**

O sistema, no estado atual, apresenta falhas graves que o tornam completamente inviável para um ambiente de produção. Os dois bugs classificados como **críticos** são suficientes para vetar o lançamento:

1.  A **lógica de negócio principal está fundamentalmente quebrada** (Bug #2). Um sistema de pontos que não debita os pontos transacionados não tem valor funcional e pode ser facilmente explorado.
2.  A **API não cumpre seu próprio contrato** (Bug #1), o que impossibilitaria o desenvolvimento e a manutenção de qualquer aplicação cliente (web, mobile) que dependa dela.

Além disso, a instabilidade no endpoint de cadastro (Bug #4) e o design pobre de tratamento de erros (Bug #3) demonstram uma falta de maturidade e qualidade que resultaria em uma péssima experiência para o usuário e altos custos de manutenção.

Lançar este sistema em produção levaria a inconsistência de dados, perda de confiança do usuário e falhas operacionais severas. É mandatório que, no mínimo, os bugs de criticidade Crítica e Alta sejam corrigidos e uma nova rodada completa de testes de regressão seja executada com sucesso.
