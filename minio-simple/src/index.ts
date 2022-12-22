import express from 'express';
import * as dotenv from 'dotenv';
import * as env from 'env-var';

dotenv.config();

const port = env.get('PORT').default('3000').asPortNumber();
const app = express();

console.log(`Listening on port ${port}`);
app.listen(port);
