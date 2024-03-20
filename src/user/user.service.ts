import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './models/user.model';
import { ImErrorCodes, toErrorMessage } from 'src/common/error';
import { RegisterDto } from 'auth/dto/verify-login-creds-dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  public async createMinimalUser(
    userExists: User,
    registerDto: RegisterDto,
  ): Promise<{ user: User }> {
    if (userExists) {
      // userExists = updateUser[1][0];
    } else {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      userExists = await this.userModel.create({
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
      });

      await userExists.save();
    }

    return { user: userExists };
  }

  public async getById(id: number): Promise<User> {
    return this.userModel.findOne({ where: { id } });
  }

  public async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
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

  public async deleteUser(userId: number): Promise<User> {
    // if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

    const findUser: User = await this.userModel.findByPk(userId);
    // if (!findUser) throw new HttpException(409, "You're not user");

    await this.userModel.destroy({ where: { id: userId } });

    return findUser;
  }
}
