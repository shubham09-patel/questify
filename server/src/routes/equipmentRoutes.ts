import { Router } from 'express';
import { EquipmentController } from '../controllers/equipmentController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/equip', EquipmentController.equip);
router.post('/unequip', EquipmentController.unequip);

export default router;
