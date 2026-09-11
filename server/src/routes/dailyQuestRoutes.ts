import { Router } from 'express';
import { DailyQuestController } from '../controllers/dailyQuestController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', DailyQuestController.getDailyQuests);
router.post('/:id/claim', DailyQuestController.claimReward);

export default router;
