import { Router } from 'express';
import { PlayerController } from '../controllers/playerController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.get('/', PlayerController.getPlayer);
router.patch('/character', PlayerController.switchCharacter);
router.get('/inventory', PlayerController.getInventory);
router.patch('/profile', PlayerController.updateProfile);

export default router;
