import {
  AppError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from '@/common/errors';
import { IUserRepository, UserObject } from '@/user/types';
import { IPromoterRepository } from '../promoter.repository';
import {
  CreatePromoterUserInput,
  UpdatePromoterOwnedUserInput,
} from '../promoter.types';

export class PromoterWriteService {
  constructor(
    private readonly promoterRepository: IPromoterRepository,
    private readonly userRepository: IUserRepository
  ) {}

  // This method is used to create a new user under a promoter's account. It takes the user data as input and returns the created user object.
  createUser = async (
    payload: CreatePromoterUserInput
  ): Promise<UserObject> => {
    try {
      const existingUser = await this.userRepository.getUserByPhoneNumber(
        payload.phoneNumber
      );

      if (existingUser) {
        throw new ConflictError('User with this phone number already exists');
      }

      return await this.promoterRepository.createUser({
        ...payload,
        roles: [],
        profileStatus: 'pending',
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        'Failed to create user',
        'PROMOTER_USER_CREATE_FAILED'
      );
    }
  };

  // This method is used to update only the editable fields of a
  // promoter-owned user.
  updateUser = async (
    promoterId: string,
    userId: string,
    payload: UpdatePromoterOwnedUserInput
  ): Promise<UserObject> => {
    try {
      const user = await this.promoterRepository.updateUser(
        promoterId,
        userId,
        payload
      );

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new InternalServerError(
        'Failed to update user',
        'PROMOTER_USER_UPDATE_FAILED'
      );
    }
  };
}
