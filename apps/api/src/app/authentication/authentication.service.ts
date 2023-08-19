import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

import { compareArgon2Hash } from '../shared/utils/hash-helpers';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LogInDto } from './dto/log-in.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayloadInterface } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async logIn(loginData: LogInDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(loginData.email);

    if (user) {
      const userInstance = plainToInstance(UserEntity, user);

      if (await this.validatePassword(userInstance.password, loginData.password)) {
        const data: JwtPayloadInterface = {
          id: userInstance.id,
          email: userInstance.email,
        };

        const accessToken = await this.generateToken(data);

        return {
          accessToken,
        };
      } else {
        throw new BadRequestException('Passwords do not match');
      }
    } else {
      throw new BadRequestException('Not found');
    }
  }

  async register(registerData: RegisterDto): Promise<UserEntity> {
    const user = plainToInstance(UserEntity, registerData);

    if (await this.usersService.findByEmail(user.email)) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }

    return this.usersService.save(user);
  }

  validateUser(payload: JwtPayloadInterface): Promise<UserEntity> {
    return this.usersService.findByEmail(payload.email);
  }

  private generateToken(data: object): Promise<string> {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  private validatePassword(hash: string, plain: string): Promise<boolean> {
    return compareArgon2Hash(hash, plain);
  }
}
