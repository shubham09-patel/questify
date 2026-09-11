import { Router } from 'express';
import { MissionController } from '../controllers/missionController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', MissionController.getMissions);
router.post('/', MissionController.createMission);
router.get('/:id', MissionController.getMissionById);
router.patch('/:id', MissionController.updateMission);
router.delete('/:id', MissionController.deleteMission);
router.post('/:id/complete', MissionController.completeMission);
router.post('/:id/uncomplete', MissionController.uncompleteMission);

export default router;
