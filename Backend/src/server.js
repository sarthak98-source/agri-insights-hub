import express from 'express';
import { ENV } from './lib/env.js';

const app = express();

app.get('/', (req, res) => {
    res.json('backend is running correctly');
});

app.listen(ENV.PORT, () => {
    console.log(`Server is running on port ${ENV.PORT}`);
});