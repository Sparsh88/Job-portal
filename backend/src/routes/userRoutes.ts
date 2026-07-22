import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadResume,
  toggleSaveJob,
  getSavedJobs,
} from '../controllers/userController';
import { protect } from '../middlewares/auth';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/resume', protect, uploadResume);
router.get('/saved-jobs', protect, getSavedJobs);
router.post('/saved-jobs/:jobId', protect, toggleSaveJob);

export default router;
