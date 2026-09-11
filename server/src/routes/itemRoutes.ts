import { Router } from 'express';
import { ItemController } from '../controllers/itemController';

const router = Router();

router.get('/', ItemController.getItems);
router.get('/:id', ItemController.getItemById);

export default router;
