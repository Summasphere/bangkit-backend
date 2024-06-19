import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  SerializeOptions,
  SetMetadata,
  Request,
} from '@nestjs/common';
import { HistoriesService } from './histories.service';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HistoryType, QueryHistoryDto } from './dto/query-history.dto';
import { InfinityPaginationResultType } from '../utils/types/infinity-pagination-result.type';
import { History } from './domain/history';
import { infinityPagination } from '../utils/infinity-pagination';
import { MeGuard } from '../auth/guard/me.guard';
import ServiceFactoryEnum from '../service-factory/service-factory.enum';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Histories')
@Controller({
  path: 'histories',
  version: '1',
})
@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @SerializeOptions({
    groups: ['me'],
  })
  @Get()
  @SetMetadata('serviceName', ServiceFactoryEnum.HistoriesService)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Request() req,
    @Query() query: QueryHistoryDto,
  ): Promise<InfinityPaginationResultType<History>> {
    const userId = req.user.id;
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const type = query?.type ?? HistoryType.ALL;

    return infinityPagination(
      await this.historiesService.findManyWithPagination({
        sortOptions: query?.sort,
        paginationOptions: {
          page,
          limit,
        },
        typeOptions: type,
        userId,
      }),
      { page, limit },
    );
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @Get(':id')
  @SetMetadata('serviceName', ServiceFactoryEnum.HistoriesService)
  @UseGuards(MeGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: number) {
    return this.historiesService.findOne({ id });
  }

  @SerializeOptions({
    groups: ['me'],
  })
  @SetMetadata('serviceName', ServiceFactoryEnum.HistoriesService)
  @UseGuards(MeGuard)
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.historiesService.delete(id);
  }
}
