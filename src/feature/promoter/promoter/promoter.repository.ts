import { User } from '@/user/model';
import { UserObject } from '@/user/types';
import {
  CreatePromoterOwnedUserAttrs,
  SearchablePromoterUsersFilters,
  UpdatePromoterOwnedUserInput,
} from './promoter.types';
import { PromoterHelpers } from './helpers/helpers';

export interface IPromoterRepository {
  createUser(data: CreatePromoterOwnedUserAttrs): Promise<UserObject>;
  getUsersByPromoter(
    promoterId: string,
    filters: SearchablePromoterUsersFilters,
    limit: number,
    offset: number
  ): Promise<UserObject[]>;
  getUsersCountByPromoter(
    promoterId: string,
    filters: SearchablePromoterUsersFilters
  ): Promise<number>;
  updateUser(
    promoterId: string,
    userId: string,
    data: UpdatePromoterOwnedUserInput
  ): Promise<UserObject | null>;
}

export class PromoterRepository implements IPromoterRepository {
  constructor(private readonly promoterHelpers: PromoterHelpers) {}

  // This method is used to create a new user under a promoter's account. It takes the user data as input and returns the created user object.
  async createUser(data: CreatePromoterOwnedUserAttrs): Promise<UserObject> {
    const user = await User.build(data);
    return user.toObject() as unknown as UserObject;
  }

  // This method is used to get the list of users for a promoter with pagination and filtering
  async getUsersByPromoter(
    promoterId: string,
    filters: SearchablePromoterUsersFilters,
    limit: number,
    offset: number
  ): Promise<UserObject[]> {
    const query = this.promoterHelpers.buildPromoterUsersQuery(
      promoterId,
      filters
    );
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return users.map(user => user.toObject()) as UserObject[];
  }

  // This method is used to get the total count of users for pagination purposes
  async getUsersCountByPromoter(
    promoterId: string,
    filters: SearchablePromoterUsersFilters
  ): Promise<number> {
    const query = this.promoterHelpers.buildPromoterUsersQuery(
      promoterId,
      filters
    );
    return User.countDocuments(query);
  }

  // This method is used to update a promoter-owned user while ensuring
  // the target user belongs to the promoter and is still active.
  async updateUser(
    promoterId: string,
    userId: string,
    data: UpdatePromoterOwnedUserInput
  ): Promise<UserObject | null> {
    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        promoter: promoterId,
        deletedAt: null,
      },
      { $set: data },
      { new: true }
    );

    if (!user) return null;
    return user.toObject() as unknown as UserObject;
  }
}
