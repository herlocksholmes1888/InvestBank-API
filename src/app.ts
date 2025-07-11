import express from 'express'
import { router } from './routes'

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server working at http://localhost:${port}`);
});

app.use(router);

export { app }