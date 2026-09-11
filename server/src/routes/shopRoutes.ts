import { Router } from 'express';
import { ShopController } from '../controllers/shopController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.use(requireAuth);

router.post('/:itemId/buy', ShopController.buyItem);

export default router;
