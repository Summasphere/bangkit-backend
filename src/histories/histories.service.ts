import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HistoryRepository } from './infrastructure/persistence/histories.repository';
import { SortHistoryDto, HistoryType } from './dto/query-history.dto';
import { EntityCondition } from '../utils/types/entity-condition.type';
import { History } from './domain/history';
import {
  CreateHistoryDto,
  CreateHistoryRelationalDto,
} from './dto/create-history.dto';
import { User } from '../users/domain/user';
import { JwtPayloadType } from '../auth/strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { NullableType } from '../utils/types/nullable.type';
import { IService } from '../service-factory/service-factory.interface';
import { FindOptionsWhere, IsNull } from 'typeorm';
import { HistoryEntity } from './infrastructure/persistence/relational/entities/history.entity';
import { Summary } from '../summary/domain/summary';
import { Analyzer } from '../analyzer/domain/analyzer';

@Injectable()
export class HistoriesService implements IService {
  constructor(
    private readonly historiesRepository: HistoryRepository,
    private readonly usersService: UsersService,
  ) { }

  async create(
    userJwtPayload: JwtPayloadType,
    createHistoryDto: CreateHistoryDto,
    summary: Summary | null,
    analyzer: Analyzer | null,
  ): Promise<History> {
    const user: NullableType<User> = await this.usersService.findOne({
      id: userJwtPayload.id,
    });

    const createHistoryRelationalDto: CreateHistoryRelationalDto =
      new CreateHistoryRelationalDto();
    createHistoryRelationalDto.title = createHistoryDto.title;
    createHistoryRelationalDto.user = user!;
    createHistoryRelationalDto.summary = summary ?? undefined;
    createHistoryRelationalDto.analyzer = analyzer ?? undefined;

    return await this.historiesRepository.create(createHistoryRelationalDto);
  }

  findManyWithPagination({
    sortOptions,
    paginationOptions,
    typeOptions,
    userId,
  }: {
    sortOptions?: SortHistoryDto[] | null;
    paginationOptions: any;
    typeOptions: HistoryType;
    userId: number;
  }) {
    const whereOptions: FindOptionsWhere<HistoryEntity> = {};
    whereOptions.user = { id: userId };

    switch (typeOptions) {
      case HistoryType.ALL:
        break;
      case HistoryType.SUMMARY:
        whereOptions.summaryId = undefined;
        break;
        // case HistoryType.ANALYZER:
        whereOptions.analyzerId = IsNull();
        // whereOptions = { analyzer: Not(null) };
        break;
      default:
        break;
    }

    return this.historiesRepository.findManyWithPagination({
      sortOptions,
      paginationOptions,
      whereOptions,
    });
  }

  async findOne(fields: EntityCondition<History>) {
    const history = await this.historiesRepository.findOne(fields);
    if (!history) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'historyNotExists',
        },
      });
    }
    return history;
  }

  async softDelete(id: History['id']) {
    const history = await this.historiesRepository.findOne({ id });
    if (!history) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'historyNotExists',
        },
      });
    }
    return this.historiesRepository.softDelete(id);
  }

  async delete(id: History['id']) {
    const history = await this.historiesRepository.findOne({ id });
    if (!history) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        errors: {
          id: 'historyNotExists',
        },
      });
    }
    return this.historiesRepository.delete(id);
  }

  async isMine(userId: number, resourceId: number): Promise<boolean> {
    if (isNaN(resourceId)) {
      throw new HttpException('Bad resource request', HttpStatus.BAD_REQUEST);
    }

    const history = await this.historiesRepository.findOne({ id: resourceId });
    if (!history) {
      throw new HttpException('History not found', HttpStatus.NOT_FOUND);
    }
    return userId === history!.user.id;
  }
}
