import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('challenges')
@UseGuards(AuthGuard)
export class ChallengesController {
  constructor(private readonly challenges: ChallengesService) {}

  @Get()
  list(@CurrentUser() userId: string) {
    return this.challenges.list(userId);
  }

  @Get('me')
  listMine(@CurrentUser() userId: string) {
    return this.challenges.listMine(userId);
  }

  @Post(':id/progress')
  @HttpCode(HttpStatus.OK)
  progress(@CurrentUser() userId: string, @Param('id') id: string) {
    return this.challenges.progressFor(userId, id);
  }
}
