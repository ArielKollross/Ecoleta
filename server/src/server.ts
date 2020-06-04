import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';

const app = express();
const ip = '192.168.15.13';

app.use(cors());
app.use(express.json()); //use json formtat
app.use(routes);
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.listen(3333)