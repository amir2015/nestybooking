import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Role } from '../roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId, role } = payload;
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (role && user.role !== role) {
      throw new UnauthorizedException('Role mismatch');
    }
    return user;
  }
}
