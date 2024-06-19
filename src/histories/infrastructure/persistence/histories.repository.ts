import { FindOptionsWhere } from 'typeorm';
import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { History } from '../../domain/history';

import { SortHistoryDto } from '../../dto/query-history.dto';
import { HistoryEntity } from './relational/entities/history.entity';

export abstract class HistoryRepository {
  abstract create(
    data: Omit<History, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<History>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
    whereOptions,
  }: {
    sortOptions?: SortHistoryDto[] | null;
    paginationOptions: IPaginationOptions;
    whereOptions?: FindOptionsWhere<HistoryEntity>;
  }): Promise<History[]>;

  abstract findOne(
    fields: EntityCondition<History>,
  ): Promise<NullableType<History>>;

  abstract softDelete(id: History['id']): Promise<void>;

  abstract delete(id: History['id']): Promise<void>;
}
