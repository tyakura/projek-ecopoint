import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collections: CollectionsService) {}

  @Post()
  create(@CurrentUser() userId: string, @Body() body: CreateCollectionDto) {
    return this.collections.create(userId, body);
  }

  @Get()
  list(@CurrentUser() userId: string) {
    return this.collections.list(userId);
  }
}
