import { Router } from 'express';
import {
  getCompanyProfile,
  updateCompanyProfile,
  getRecruiterDashboard,
  getRecruiterJobs,
} from '../controllers/recruiterController';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/rbac';

const router = Router();

router.get('/company', protect, restrictTo('RECRUITER', 'ADMIN'), getCompanyProfile);
router.put('/company', protect, restrictTo('RECRUITER', 'ADMIN'), updateCompanyProfile);
router.get('/dashboard', protect, restrictTo('RECRUITER', 'ADMIN'), getRecruiterDashboard);
router.get('/jobs', protect, restrictTo('RECRUITER', 'ADMIN'), getRecruiterJobs);

export default router;
