/* Como a InvestBank atende usuários
// brasileiros, os endpoints estão 
// em português! 
*/
import express from 'express'
import { User } from './types'

const app = express();
const router = app.router;

// MOCK DATA
    // Usuários
        let users: User[] = [
            { id: 1, nome: "Sherlock Holmes", saldo: 20000.00 },
            { id: 2, nome: "Aquiles Pelida", saldo: 100000.00 }
        ];

    // Investimentos disponíveis
        let investiments = [
            { "id": 1, "nome": "Tesouro Direto", "tipo": "fixo", "preco-minimo": 150.00 },
            { "id": 2, "nome": "ACME Ações", "tipo": "variavel", "preco-minimo": 1000.00 },
            { "id": 1, "nome": "CDB", "tipo": "fixo", "preco-minimo": 30.00 },
            { "id": 1, "nome": "Kryptonite Ltda", "tipo": "variavel", "preco-minimo": 2000.00 },
        ];

// GET
    // Usuários
        router.get('/', (req, res) => {
            res.json(users);
        });

    // Saldo
        router.get('/saldo', (req, res) => {
            const id = req.body.id;

            const user = users.find((user) => user.id === id);

            if(user) {
                res.json(`Seu saldo é de: ${user.saldo}`);
            } else {
                res.status(404).json('Usuário não encontrado.');
            }
        });

// POST
    // Usuário
        router.post('/criarUsuario', (req, res) => {
            const newUser = req.body;
            newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            users.push(newUser);

            res.status(201).json(newUser);
        });

    // Depósito
        router.post('/deposito', (req, res) => {
            
        });

    // Transferência
        router.post('/transferencia', (req, res) => {
            const { senderID, receiverID, amount } = req.body;

            // Verificação de usuários
                let sender = users.find((user) => user.id === senderID);
                let receiver = users.find((user) => user.id === receiverID);

                if(!sender) {
                    res.status(404).json('Usuário não encontrado.');
                }

                if(!receiver) {
                    res.status(404).json('Usuário não encontrado.');
                }

            // Verificação de saldo
                // TODO: Descobrir uma maneira de excluir a possibilidade de sender e receiver
                // serem undefined. Talvez implementar o type User que foi criado.
                if(sender.saldo < amount) {
                    res.status(400).json('Saldo insuficiente.');
                }

            // TODO: Modificar esta lógica quando a Conta Investimentos for implementada
            // nesta API.
            if (sender != receiver) {
                sender.saldo -= amount + (amount * 0.5);
            } else {
                sender.saldo -= amount;
            }

            receiver.saldo += amount;

            res.status(200).json(`Transferência realizada com sucesso! Seu saldo atual: ${sender.saldo}`);
        });

// DELETE
    // Users
        router.delete('/deletarUsuario', (req, res) => {
            const userIdToDelete = req.body.id;

            if (!userIdToDelete) {
                return res.status(400).json({ message: "Sem o ID, não podemos realizar a deleção do usuário." });
            }

            const initialUsersLength = users.length;

            users = users.filter(user => user.id !== userIdToDelete);

            if (users.length === initialUsersLength) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            console.log(users);
            res.status(204).send();
        });

export { router }