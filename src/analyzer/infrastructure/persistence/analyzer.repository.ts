import { EntityCondition } from '../../../utils/types/entity-condition.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Analyzer } from '../../domain/analyzer';

import { SortAnalyzerDto } from '../../dto/query-analyzer.dto';

export abstract class AnalyzerRepository {
  abstract create(data: Omit<Analyzer, 'id'>): Promise<Analyzer>;

  abstract findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortAnalyzerDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Analyzer[]>;

  abstract findOne(
    fields: EntityCondition<Analyzer>,
  ): Promise<NullableType<Analyzer>>;

  abstract softDelete(id: Analyzer['id']): Promise<void>;
}
