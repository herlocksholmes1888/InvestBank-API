# Seja bem-vindo_ ao Investbank 👋🏽

O Investbank é um banco fictício, criado exclusivamente para o [3º Hackathon da comunidade Orange Juice](https://github.com/orangejuicetech/orangebank). Ele foi projetado para atender a investidores que não abrem mão da praticidade ao escolherem seu banco; afinal de contas, ele já vem com uma conta de investimentos! Não há necessidade de instalar um aplicativo exclusivo da sua corretora.

## ✨ Funcionalidades 
* Cadastre-se e atrele suas contas a um usuário
* Gerencie depósitos, transferências, saques e consulte seu saldo na sua CC (Conta Corrente)
* Compre ativos na sua CI (Conta do Investidor)

## 📝 Dados de teste
### Usuários
Foram criados dois usuários a fim de testar a Investbank API. São eles:

* Sherlock Holmes, com ID 1
* Aquiles Pelida, com ID 2

Ambos têm conta corrente, porém apenas Holmes tem uma conta de investimentos.

Com esses dados, você pode brincar com a API simulando transferências entre eles. 

### Ativos
Foram criados quatro ativos a fim de testar a Investbank API. São eles:
* Tesouro Direto SELIC, uma renda fixa que custa R$150 para iniciar
* ACME Investimentos, uma renda variável que custa R$1000 para iniciar
* CDB, uma renda fixa que custa R$30 para iniciar
* Kryptonite Ltda, uma renda variável que custa R$2000 para iniciar

Com esses dados, você pode brincar com a API simulando a compra de ativos. Lembre-se de que o único usuário que pode realizar esta ação é o usuário de ID 1, pois é o único com uma conta de investimentos.

## 📚 Endpoints
Visto que o Investbank foi criado durante um Hackathon, não tivemos tempo de adicionar todas as funcionalidades disponíveis em uma boa API. No entanto, focamos nestas:

``
    GET /usuarios
    GET /saldo

    POST /criarUsuario
    POST /deposito
    POST /transferencia

    DELETE /deletarUsuario
``

Para fazer com que cada uma delas funcione, é necessário enviar requisições via Body, seguindo os seguintes formatos JSON:

``
GET /saldo -> Body: {
    "accountId": 1
}

POST /criarUsuario -> Body: {
    "id": 3,
    "nome": "Fulano da Silva"
}

POST /deposito -> Body: {
    "accountId": 1,
    "amount": 100
}

POST /transferencia -> Body {
    "senderId": 1,
    "senderAccountId": 1,
    "receiverId": 2,
    "receiverAccountId": 2,
    "amount": 100
}

DELETE /deletarUsuario -> Body {
    "userId": 1
}
``

Lembre-se de que o padrão monetário da Investbank API é reais. 