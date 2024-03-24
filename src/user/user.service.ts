import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './models/user.model';
import { ImErrorCodes, toErrorMessage } from 'src/common/error';
import { RegisterDto } from 'src/auth/dto/verify-login-creds-dtos';
import { UpdateUserDto } from './dto/user-profile.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  public async createMinimalUser(
    userExists: User,
    registerDto: RegisterDto,
  ): Promise<{ user: User }> {
    if (!userExists) {
      userExists = await this.userModel.create({
        address: registerDto.address,
      });

      await userExists.save();
    }

    return { user: userExists };
  }

  public async getByAddress(address: string): Promise<User> {
    return this.userModel.findOne({ where: { address } });
  }

  public async getById(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  public async updateUser(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { name, email, address, privateKey } = updateUserDto;

    return this.userModel.update(
      {
        ...(name && { name }),
        ...(email && { email }),
        ...(address && { address }),
        ...(privateKey && { privateKey }), //TODO: Need to encrypt and store, CONFIDENTIAL
      },
      { where: { id: user.id } },
    )[1];
  }

  public async findUserById(userId: number): Promise<User> {
    if (!userId)
      throw new BadRequestException(
        toErrorMessage(ImErrorCodes.BAD_REQUEST, ' No userID provided'),
      );
    const findUser: User = await this.userModel.findOne({
      where: {
        id: userId,
      },
    });
    if (!findUser)
      throw new InternalServerErrorException(
        toErrorMessage(ImErrorCodes.INTERNAL_SERVER_ERROR, "You're not user"),
      );

    return findUser;
  }

  public async findUserByAddress(address: string): Promise<User> {
    if (!address)
      throw new BadRequestException(
        toErrorMessage(ImErrorCodes.BAD_REQUEST, ' No address provided'),
      );
    const findUser: User = await this.userModel.findOne({
      where: {
        address,
      },
    });

    return findUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    // if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.userModel.findByPk(userId);
    // if (!findUser) throw new HttpException(409, "You're not user");

    await this.userModel.destroy({ where: { id: userId } });

    return findUser;
  }
}
