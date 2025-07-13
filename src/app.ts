import express from 'express'
import cors from 'cors';
import { router } from './routes'

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.use(express.json());
app.use(cors());
app.use(router);

export { app }