import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Summary } from '../../domain/summary';

import { SortSummaryDto } from '../../dto/query-summary.dto';

export abstract class SummaryRepository {
  abstract create(data: Omit<Summary, 'id'>): Promise<Summary>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortSummaryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Summary[]>;

  abstract findOne(
    fields: EntityCondition<Summary>,
  ): Promise<NullableType<Summary>>;

  abstract softDelete(id: Summary['id']): Promise<void>;
}
