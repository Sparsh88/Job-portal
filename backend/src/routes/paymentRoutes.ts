import { Router } from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentController';
import { protect } from '../middlewares/auth';

const router = Router();

router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/history', getPaymentHistory);

export default router;
