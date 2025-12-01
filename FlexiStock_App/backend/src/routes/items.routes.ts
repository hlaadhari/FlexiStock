import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', authMiddleware, ItemController.getAll);
router.get('/low-stock', authMiddleware, ItemController.getLowStock);
router.get('/:id', authMiddleware, ItemController.getById);
router.post('/', authMiddleware, requireRole('ADMIN', 'MANAGER'), ItemController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), ItemController.update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), ItemController.delete);

export default router;
