import { Request, Response } from 'express';
import { env } from '@/env';
import { ResponseUtil } from '@/utils/response';
import { PromoterReadService } from './service/read';
import { PromoterWriteService } from './service/write';
import {
  createPromoterUserReqSchema,
  getPromoterUsersReqSchema,
  updatePromoterUserReqSchema,
} from './promoter.schema';

export class PromoterController {
  constructor(
    private readonly promoterReadService: PromoterReadService,
    private readonly promoterWriteService: PromoterWriteService
  ) {}

  getUsersList = async (req: Request, res: Response) => {
    const { query } = getPromoterUsersReqSchema.parse(req);
    const { users, paginationMeta } =
      await this.promoterReadService.getUsersList(req.user!.id, query);

    return ResponseUtil.paginatedMeta(
      res,
      'Users fetched successfully',
      users,
      paginationMeta
    );
  };

  createUser = async (req: Request, res: Response) => {
    const { body } = createPromoterUserReqSchema.parse(req);
    const user = await this.promoterWriteService.createUser({
      ...body,
      phoneNumber: `${env.COUNTRY_CODE}${body.phoneNumber}`,
      promoter: req.user!.id,
    });

    return ResponseUtil.created(res, 'User created successfully', user);
  };

  updateUser = async (req: Request, res: Response) => {
    const { params, body } = updatePromoterUserReqSchema.parse(req);
    const user = await this.promoterWriteService.updateUser(
      req.user!.id,
      params.id,
      body
    );

    return ResponseUtil.ok(res, 'User updated successfully', user);
  };
}
