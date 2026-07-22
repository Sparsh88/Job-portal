import { Router } from 'express';
import {
  scheduleInterview,
  getMyInterviews,
  updateInterview,
  getAIMockQuestions,
  evaluateAIMockResponse,
} from '../controllers/interviewController';
import { protect } from '../middlewares/auth';
import { restrictTo } from '../middlewares/rbac';

const router = Router();

router.use(protect);

router.post('/schedule', restrictTo('RECRUITER', 'ADMIN'), scheduleInterview);
router.get('/my', getMyInterviews);
router.put('/:id', restrictTo('RECRUITER', 'ADMIN'), updateInterview);
router.get('/ai-mock/questions', getAIMockQuestions);
router.post('/ai-mock/evaluate', evaluateAIMockResponse);

export default router;
