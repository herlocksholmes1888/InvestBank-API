/* Como a InvestBank atende usuários
// brasileiros, os endpoints estão 
// em português! 
*/
import express from 'express'

const app = express();
const router = app.router;

// MOCK DATA
    // Usuários
        let users = [
            { "id": 1, "nome": "Sherlock Holmes", "saldo": 20000.00 },
            { "id": 2, "nome": "Aquiles Pelida", "saldo": 100000.00 }
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
        router.get("/", (req, res) => {
            res.json(users);
        });
    // Saldo

// POST
    // Usuário
        router.post('/criarUsuario', (req, res) => {
            const newUser = req.body;
            newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

            users.push(newUser);

            res.status(201).json(newUser);
        });
    // Depósito

    // Transferência

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
    // Investimentos

export { router }