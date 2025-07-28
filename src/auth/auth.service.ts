import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: Omit<User, 'password'> }> {
    const { email, password } = registerDto;

    try {
      const user = await this.usersService.create(email, password);
      const { password: _, ...userWithoutPassword } = user;

      return {
        message: 'User registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException('User with this email already exists');
      }
      throw error;
    }
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; user: Omit<User, 'password'> }> {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid email ');
    }
    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    const { password: _, ...userWithoutPassword } = user;
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: userWithoutPassword,
    };
  }
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
