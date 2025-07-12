/* Como a InvestBank atende usuários
// brasileiros, os endpoints estão 
// em português! 
*/
import express from 'express'

const app = express();
const router = app.router;

// MOCK DATA
let users = [
    { "id": 1, "nome": "Sherlock Holmes", "email": "xeroqueroumis@email.com" },
    { "id": 2, "nome": "Aquiles Pelida", "email": "calcanhar@email.com" },
];

// GET
router.get("/", (req, res) => {
    res.json(users);
});

// POST
router.post('/', (req, res) => {
    const newUser = req.body;
    newUser.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    users.push(newUser);

    res.status(201).json(newUser);
});

// PATCH

// PUT

// DELETE
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