import { Router } from 'express';
import { CategoryController } from '../controllers/CategoryController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/rbac';

const router = Router();

router.get('/', authMiddleware, CategoryController.getAll);
router.get('/:id', authMiddleware, CategoryController.getById);
router.post('/', authMiddleware, requireRole('ADMIN', 'MANAGER'), CategoryController.create);
router.put('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), CategoryController.update);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), CategoryController.delete);

export default router;
