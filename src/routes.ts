/* Como a InvestBank atende usuários
// brasileiros, os endpoints estão 
// em português! 
*/
import express from 'express'
import { User, Account } from './types' 

const router = express.Router(); 

// MOCK DATA
    // Usuários
        let users: User[] = [
            { id: 1, nome: "Sherlock Holmes" },
            { id: 2, nome: "Aquiles Pelida" }
        ];

    // Contas
        let accounts: Account[] = [
            { id: 1, usuarioId: 1, tipo: "CC", saldo: 100.00 },
            { id: 2, usuarioId: 1, tipo: "CI", saldo: 500.00 },
            { id: 3, usuarioId: 2, tipo: "CC", saldo: 200.00 }, 
        ];

    // Investimentos disponíveis
        // TODO: Criar um algoritmo que faz com que os preços das rendas variáveis flutuem dinamicamente
        let investments = [
            { "id": 1, "nome": "Tesouro Direto SELIC", "tipo": "fixo", "preco-minimo": 150.00 },
            { "id": 2, "nome": "ACME Investimentos", "tipo": "variavel", "preco-minimo": 1000.00 },
            { "id": 3, "nome": "CDB", "tipo": "fixo", "preco-minimo": 30.00 }, 
            { "id": 4, "nome": "Kryptonite Ltda", "tipo": "variavel", "preco-minimo": 2000.00 }, 
        ];

// GET
    // Usuários
        router.get('/usuarios', (req, res) => {
            if(users.length > 0) {
                console.log(users);
                res.status(200).json(users);
            } else {
                res.status(200).json('Esta aplicação ainda não tem usuários.');
            }
        });

    // Investimentos 
        router.get('/investimentos', (req, res) => {
            if(investments.length > 0){
                console.log(investments)
                res.status(200).json(investments);
            } else {
                res.status(200).json('Esta aplicação ainda não tem investimentos disponíveis.');
            }
        });

    // Saldo
        router.get('/saldo', (req, res) => {
            const accountId = parseInt(req.query.accountId as string); 

            const account = accounts.find((account) => account.id === accountId);

            if(account) {
                res.json(`Seu saldo é de: ${account.saldo}`);
            } else {
                res.status(404).json('Conta não encontrada.');
            }
        });

// POST
    // Usuário
        router.post('/criarUsuario', (req, res) => {
            const { newUserId, newUserName } = req.body;

            if (!users.some(user => user.id === newUserId)) {
                const newUser: User = { id: parseInt(newUserId), nome: newUserName };

                users.push(newUser);

                console.log(users);
                res.status(201).json(newUser);
            } else {
                res.status(400).json('Um usuário com este ID já existe! Por favor, escolha outro.');
            }
        });

    // Conta
        router.post('/criarConta', (req, res) => {
            const { accountId, userId, accountType } = req.body;
            const newAccount: Account = { id: parseInt(accountId), usuarioId: userId, tipo: accountType, saldo: 0 };

            if(!accounts.some(account => account.id === accountId)) {
                accounts.push(newAccount);

                res.status(201).json(newAccount);
            } else {
                res.status(400).json('Uma conta com este ID já existe! Por favor, escolha outro.');
            }
        });

    // Depósito
        router.post('/deposito', (req, res) => {
            const { accountId, amount } = req.body;

            const account = accounts.find((acc) => acc.id === accountId);

            if(account) {
                if(amount <= 0) {
                    return res.status(400).json('O valor do depósito deve ser positivo.');
                }
                account.saldo += amount;
                res.status(200).json(`Depósito realizado com sucesso! Novo saldo da conta ${accountId}: ${account.saldo}`);
            } else {
                res.status(404).json('Conta não encontrada.');
            }
        });

    // Transferência
        router.post('/transferencia', (req, res) => {
            const { senderId, senderAccountId, receiverId, receiverAccountId, amount } = req.body;

            const sender = accounts.find((account) => account.id === senderId);
            const receiver = accounts.find((account) => account.id === receiverId);
            const senderAccount = accounts.find((account) => account.id === senderAccountId);
            const receiverAccount = accounts.find((account) => account.id === receiverAccountId);

            // Verificações
                if (!senderAccount) {
                    return res.status(404).json('Conta de origem não encontrada.');
                }

                if (!receiverAccount) {
                    return res.status(404).json('Conta de destino não encontrada.');
                }

                if (amount <= 0) {
                    return res.status(400).json('O valor da transferência deve ser positivo.');
                }

            // Cálculo de transferência
                function transfer(sender, senderAccount, receiver, receiverAccount, amount) {
                    if(amount > senderAccount.saldo){
                        res.status(400).json(`Saldo insuficiente! Seu saldo atual é de ${senderAccount.saldo}.`);
                    } else {
                        if (sender.usuarioId === receiver.usuarioId) {
                            senderAccount.saldo -= amount;
                        } else {
                            const fee = amount * 0.005;
                            senderAccount.saldo -= (amount + fee);
                        }
                    }

                    receiverAccount.saldo += amount;

                    return senderAccount.saldo;
                }

                let currentBalance = transfer(sender, senderAccount, receiver, receiverAccount, amount);

                console.log(accounts);
                res.status(200).json(`Transferência realizada com sucesso! Seu saldo é de: ${currentBalance}`);
        });

    // Ativos
        router.post('/comprarAtivo', (req, res) => {
            const { accountId, investmentId, investmentPaidPrice } = req.body;

            const investment = investments.find((investment) => investment.id === investmentId);
            const account = accounts.find((account) => account.id === accountId && account.tipo === "CI");

            // Verificações
                if (!investment) {
                    return res.status(404).json('O ativo que você quer comprar não existe. Por favor, insira um ativo válido.');
                }

                if(!account) {
                    return res.status(400).json('Você está tentando comprar um ativo através de uma conta que não existe, ou através de uma conta corrente. Crie uma conta de investimentos para prosseguir com a compra.');
                }

            function amountOfInvestments(minimumPrice, paidPrice) {
                const brokarageFee = 0.001;
                const min = minimumPrice + (minimumPrice * brokarageFee);
                const paid = paidPrice;

                if(!investment) {
                    res.status(404).json('O ativo que você quer comprar não existe. Por favor, insira um ativo válido.');
                }

                if (paid < min) {
                    return {
                        error: true,
                        statusCode: 400,
                        message: `O ativo que você quer comprar custa R$${min}. O valor R$${paid} não é o suficiente para comprá-lo.`
                    };
                }

                // Cálculo de quantos ativos podem ser comprados
                const numberOfAssets = Math.floor(paid / min); 
                const remainder = paid % min; 

                if (numberOfAssets > 0) {
                    let message = `Parabéns! Com R$${paid}, você comprou ${numberOfAssets} ativo(s).`;
                    account.saldo -= paid;

                    if (remainder > 0) {
                        message += ` Sobrou R$${remainder}. Este valor não é suficiente para comprar outro ativo e, por isso, foi estornado para a sua conta.`;

                        account.saldo += remainder;
                        console.log(accounts);
                    }
                    return {
                        error: false,
                        statusCode: 200,
                        message: message
                    };
                } else {
                    // Idealmente, esta parte do código nunca vai rodar 
                    // Mas vou deixar isso escrito aqui por precaução
                    return {
                        error: true,
                        statusCode: 400,
                        message: `O valor R$${paid} não é suficiente para comprar nem mesmo um ativo que custa R$${min}.`
                    };
                }
            }

            const result = amountOfInvestments(investment['preco-minimo'], investmentPaidPrice);

            if (result.error) {
                return res.status(result.statusCode).json(result.message);
            } else {
                console.log(accounts);
                return res.status(200).json(result.message);
            }
        });

        router.post('/resgatarAtivo', (req, res) => {
            const { accountId, investmentId } = req.body;

            const investment = investments.find((investment) => investment.id === investmentId);
            const account = accounts.find((account) => account.id === accountId && account.tipo === "CI");

            // Verificações
                if(!investment) {
                    res.status(404).json('O investimento informado não existe.');
                }

                if(!account) {
                    res.status(404).json('A conta não existe.');
                }
            
            if(investment?.tipo === "fixo") {
                const fixedIncomeFees = 0.15;

                account.saldo -= (account.saldo * fixedIncomeFees);
                account.saldo += investment['preco-minimo'];

                console.log(accounts);
                res.status(200).json(`Resgate realizado! Seu saldo é de: ${account.saldo}`);
            } else {
                const variableIncomeFees = 0.22;

                account.saldo -= (account.saldo * variableIncomeFees);
                account.saldo += investment['preco-minimo'];

                console.log(accounts);
                res.status(200).json(`Resgate realizado! Seu saldo é de: ${account.saldo}`);
            }
        });

// DELETE
    // Users
    // TODO: Ao deletar um usuário, todas as contas atreladas a ele devem ser deletadas, também
        router.delete('/deletarUsuario', (req, res) => {
            const userId = req.body.id;

            if (!userId) {
                return res.status(400).json({ message: "Sem o ID, não podemos realizar a deleção do usuário." });
            }

            const initialUsersLength = users.length;

            users = users.filter((user) => user.id !== userId);

            if (users.length === initialUsersLength) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            console.log(users);
            res.status(204).send();
        });

export { router }