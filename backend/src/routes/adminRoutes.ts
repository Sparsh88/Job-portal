import { Router } from 'express';
import {
  getAdminMetrics,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/rbac';

const router = Router();

router.use(protect, restrictTo('ADMIN'));

router.get('/metrics', getAdminMetrics);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
