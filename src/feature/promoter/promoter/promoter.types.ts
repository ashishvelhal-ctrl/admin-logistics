import { UserAttrs, UserObject } from '@/user/types';
import { PaginationMeta } from '@/utils/pagination';

export interface PromoterUsersListData {
  users: UserObject[];
  paginationMeta: PaginationMeta;
}

export interface CreatePromoterUserInput {
  name: string;
  phoneNumber: string;
  address: string;
  promoter: string;
}

export interface UpdatePromoterOwnedUserInput {
  name?: string;
  address?: string;
}

export type SearchablePromoterUsersFilters = {
  search?: string;
};

export type CreatePromoterOwnedUserAttrs = Pick<
  UserAttrs,
  'name' | 'phoneNumber' | 'address' | 'roles' | 'profileStatus' | 'promoter'
>;
