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

// Public AI Mock Interview routes
router.get('/ai-questions', getAIMockQuestions);
router.get('/ai-mock/questions', getAIMockQuestions);
router.post('/ai-evaluate', evaluateAIMockResponse);
router.post('/ai-mock/evaluate', evaluateAIMockResponse);

// Protected interview management routes
router.use(protect);

router.post('/schedule', restrictTo('RECRUITER', 'ADMIN'), scheduleInterview);
router.get('/my', getMyInterviews);
router.put('/:id', restrictTo('RECRUITER', 'ADMIN'), updateInterview);

export default router;
