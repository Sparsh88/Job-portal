import { Router } from 'express';
import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  calculateAIMatchScore,
} from '../controllers/jobController';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/rbac';

const router = Router();

router.get('/', getAllJobs);
router.get('/:id', getJobById);
router.post('/', protect, restrictTo('RECRUITER', 'ADMIN'), createJob);
router.put('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), updateJob);
router.delete('/:id', protect, restrictTo('RECRUITER', 'ADMIN'), deleteJob);
router.post('/:id/match', protect, calculateAIMatchScore);

export default router;
