import express from 'express'

const app = express();
const router = app.router;

// GET
router.get("/", (req, res) => {
    res.send('Yippie!');
});

export { router }