import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import itemsRoutes from './routes/items.routes';
import categoriesRoutes from './routes/categories.routes';
import stockRoutes from './routes/stock.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/stock', stockRoutes);

export default app;
