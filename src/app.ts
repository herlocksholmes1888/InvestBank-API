import express from 'express'
import { router } from './routes'

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());
app.use(router);

export { app }