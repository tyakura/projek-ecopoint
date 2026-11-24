import { Controller, Get, UseGuards } from '@nestjs/common';
import { AchievementsService } from './achievements.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('achievements')
@UseGuards(AuthGuard)
export class AchievementsController {
  constructor(private readonly achievements: AchievementsService) {}

  @Get()
  list(@CurrentUser() userId: string) {
    return this.achievements.list(userId);
  }

  @Get('me')
  listMine(@CurrentUser() userId: string) {
    return this.achievements.list(userId);
  }
}
