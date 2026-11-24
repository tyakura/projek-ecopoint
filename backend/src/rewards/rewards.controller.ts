import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('rewards')
@UseGuards(AuthGuard)
export class RewardsController {
  constructor(private readonly rewards: RewardsService) {}

  @Get()
  list() {
    return this.rewards.listActive();
  }

  @Get('redemptions')
  redemptions(@CurrentUser() userId: string) {
    return this.rewards.listRedemptions(userId);
  }

  @Post(':id/redeem')
  redeem(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.rewards.redeem(userId, id);
  }
}
