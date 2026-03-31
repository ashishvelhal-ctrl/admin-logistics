import { AppError, InternalServerError } from '@/common/errors';
import { buildPaginationMeta } from '@/utils/pagination';
import { IPromoterRepository } from '../promoter.repository';
import { GetPromoterUsersReq } from '../promoter.schema';
import { PromoterUsersListData } from '../promoter.types';

export class PromoterReadService {
  constructor(private readonly promoterRepository: IPromoterRepository) {}

  // This method is used to get the list of users for a promoter with pagination and filtering
  getUsersList = async (
    promoterId: string,
    query: GetPromoterUsersReq['query']
  ): Promise<PromoterUsersListData> => {
    try {
      const filters = {
        ...(query.search?.trim() ? { search: query.search.trim() } : {}),
      };

      const [users, total] = await Promise.all([
        this.promoterRepository.getUsersByPromoter(
          promoterId,
          filters,
          query.limit,
          query.offset
        ),
        this.promoterRepository.getUsersCountByPromoter(promoterId, filters),
      ]);

      return {
        users,
        paginationMeta: buildPaginationMeta(total, query.limit, query.offset),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        'Failed to fetch promoter users',
        'PROMOTER_USERS_FETCH_FAILED'
      );
    }
  };
}
