import { Router } from 'express';
import { authMiddleware, promoterController } from '@/bootstrap/container';
import { checkRole } from '@/middlewares/check-role.middleware';

const router: Router = Router();

router.get(
  '/users',
  authMiddleware,
  checkRole({ any: ['promoter'] }),
  promoterController.getUsersList
);

router.post(
  '/user',
  authMiddleware,
  checkRole({ any: ['promoter'] }),
  promoterController.createUser
);

router.patch(
  '/user/:id',
  authMiddleware,
  checkRole({ any: ['promoter'] }),
  promoterController.updateUser
);

export { router as promoterRouter };
