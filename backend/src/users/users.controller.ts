import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { publicUser } from '../common/game';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  me(@CurrentUser() userId: string) {
    const user = this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return publicUser(user);
  }

  @Put('me')
  update(@CurrentUser() userId: string, @Body() body: UpdateUserDto) {
    this.users.update(userId, (body.name ?? '').trim(), body.avatar ?? '');
    const user = this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return publicUser(user);
  }
}
