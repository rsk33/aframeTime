import express from 'express';
import path from 'node:path';
import * as dotenv from 'dotenv';
import { reportISSTimeZone } from './src/report_iss_timezone.js';

dotenv.config()
const app = express()

app.use(express.static(path.join(process.cwd(), 'public')));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`[server]: aframetime app listening on port ${port}`);
})

app.get('/api/isstime', async (req, res) => {
    console.log(`[server]: app get /api/isstime`);
    const data = await reportISSTimeZone(); 
    res.json(data);
})