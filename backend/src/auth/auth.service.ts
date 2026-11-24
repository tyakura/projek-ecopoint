import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { newId, nowIso, publicUser } from '../common/game';
import { UserRow } from '../common/models';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
  ) {}

  async register(body: RegisterDto) {
    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const username = (body.username ?? '').trim();
    const password = body.password ?? '';
    const confirmPassword = body.confirm_password ?? '';

    if (!name || !email || !username || !password) {
      throw new BadRequestException('all fields are required');
    }
    if (!email.includes('@')) {
      throw new BadRequestException('invalid email address');
    }
    if (password.length < 6) {
      throw new BadRequestException('password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      throw new BadRequestException('password confirmation does not match');
    }
    if (this.users.findByEmail(email)) {
      throw new ConflictException('email already registered');
    }
    if (this.users.findByUsername(username)) {
      throw new ConflictException('username already taken');
    }

    const now = nowIso();
    const user: UserRow = {
      id: newId(),
      name,
      email,
      username,
      password_hash: hashSync(password, 10),
      avatar: null,
      points: 0,
      xp: 0,
      level: 1,
      total_waste: 0,
      total_items: 0,
      created_at: now,
      updated_at: now,
    };

    this.users.create(user);
    const token = await this.jwt.signAsync({ sub: user.id });
    return { token, user: publicUser(user) };
  }

  async login(body: LoginDto) {
    const email = (body.email ?? '').trim();
    const user = this.users.findByEmail(email);

    if (!user || !compareSync(body.password ?? '', user.password_hash)) {
      throw new UnauthorizedException('invalid email or password');
    }

    const token = await this.jwt.signAsync({ sub: user.id });
    return { token, user: publicUser(user) };
  }

  logout() {
    return { success: true };
  }
}
