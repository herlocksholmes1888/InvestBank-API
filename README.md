# Seja bem-vindo_ ao Investbank 👋🏽

O Investbank é um banco fictício, criado exclusivamente para o [3º Hackathon da comunidade Orange Juice](https://github.com/orangejuicetech/orangebank). Ele foi projetado para atender a investidores que não abrem mão da praticidade ao escolherem seu banco; afinal de contas, ele já vem com uma conta de investimentos! Não há necessidade de instalar um aplicativo exclusivo da sua corretora.

## ✨ Funcionalidades 
* Cadastre-se e atrele suas contas a um usuário
* Gerencie depósitos, transferências, saques e consulte seu saldo na sua CC (Conta Corrente)
* Compre ativos na sua CI (Conta do Investidor)
* Visualize seu histórico de transações

### 📚 Endpoints
Visto que o Investbank foi criado durante um Hackathon, não tivemos tempo de adicionar todos os comandos possívels. No entanto, focamos nestes:
``
    GET /
    GET /saldo

    POST /criarUsuario
    POST /deposito
    POST /transferencia

    DELETE /deletarUsuario
``