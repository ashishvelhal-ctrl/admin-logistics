import { AppError, InternalServerError } from '@/common/errors';
import { SearchablePromoterUsersFilters } from '../promoter.types';

export class PromoterHelpers {
  buildPromoterUsersQuery = (
    promoterId: string,
    filters: SearchablePromoterUsersFilters
  ) => {
    try {
      const query: Record<string, unknown> = {
        promoter: promoterId,
        deletedAt: null,
      };

      const search = filters.search?.trim();
      if (search) {
        query.$or = [
          { phoneNumber: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } },
        ];
      }

      return query;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        'Failed to build promoter user query',
        'PROMOTER_USER_QUERY_BUILD_FAILED'
      );
    }
  };
}
