import { Router } from 'express';
import { StockController } from '../controllers/StockController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/movements', authMiddleware, StockController.getMovements);
router.post('/movements', authMiddleware, requireRole('ADMIN', 'MANAGER'), StockController.createMovement);
router.get('/movements/item/:itemId', authMiddleware, StockController.getItemMovements);

export default router;
