import { Router } from 'express';
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
} from '../controllers/applicationController';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/rbac';

const router = Router();

router.post('/', protect, restrictTo('JOB_SEEKER'), applyForJob);
router.get('/my', protect, restrictTo('JOB_SEEKER'), getMyApplications);
router.get('/job/:jobId', protect, restrictTo('RECRUITER', 'ADMIN'), getJobApplications);
router.put('/:id/status', protect, restrictTo('RECRUITER', 'ADMIN'), updateApplicationStatus);
router.delete('/:id', protect, restrictTo('JOB_SEEKER'), withdrawApplication);

export default router;
