import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import itemsRoutes from './routes/items.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);

export default app;
