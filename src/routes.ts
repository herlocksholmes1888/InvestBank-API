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
        let investiments = [
            { "id": 1, "nome": "Tesouro Direto SELIC", "tipo": "fixo", "preco-minimo": 150.00 },
            { "id": 2, "nome": "ACME Investimentos", "tipo": "variavel", "preco-minimo": 1000.00 },
            { "id": 3, "nome": "CDB", "tipo": "fixo", "preco-minimo": 30.00 }, 
            { "id": 4, "nome": "Kryptonite Ltda", "tipo": "variavel", "preco-minimo": 2000.00 }, 
        ];

// GET
    // Usuários
        router.get('/usuarios', (req, res) => { 
            res.json(users);
        });

    // Saldo
        router.get('/saldo', (req, res) => {
            const accountId = req.body.accountId;

            const account = accounts.find((acc) => acc.id === accountId);

            if(account) {
                res.json(`Seu saldo é de: ${account.saldo}`);
            } else {
                res.status(404).json('Conta não encontrada.');
            }
        });

// POST
    // Usuário
        router.post('/criarUsuario', (req, res) => {
            const newUser = req.body;

            users.push(newUser);

            res.status(201).json(newUser);
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
                    if (sender.usuarioId === receiver.usuarioId) {
                        senderAccount.saldo -= amount;
                    } else {
                        const fee = amount * 0.05;
                        senderAccount.saldo -= (amount + fee);
                    }

                    receiverAccount.saldo += amount;

                    return senderAccount.saldo;
                }

                let currentBalance = transfer(sender, senderAccount, receiver, receiverAccount, amount);

                console.log(accounts);

                res.status(200).json(`Transferência realizada com sucesso! Seu saldo é de: ${currentBalance}`);
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

            users = users.filter(user => user.id !== userId);

            if (users.length === initialUsersLength) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            console.log(users);
            res.status(204).send();
        });

export { router }