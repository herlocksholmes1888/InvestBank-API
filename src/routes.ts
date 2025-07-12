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

    console.log(newUser);
    res.status(201).json(newUser);
});

// PATCH

// PUT

// DELETE
router.delete('/deletarUsuario', (req, res) => {
    const userId = req.body;

    const userToBeDeleted = users.findIndex((user) => user.id === userId);

    delete users[userToBeDeleted];

    res.status(204).json(users);
});

export { router }