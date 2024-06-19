import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { SummaryRepository } from '../../summary.repository';
import { SummaryEntity } from '../entities/summary.entity';
import { Summary } from '../../../../domain/summary';
import { SummaryMapper } from '../mappers/summary.mapper';
import { SortSummaryDto } from '../../../../dto/query-summary.dto';

@Injectable()
export class SummaryRelationalRepository implements SummaryRepository {
  constructor(
    @InjectRepository(SummaryEntity)
    private readonly historiesRepository: Repository<SummaryEntity>,
  ) {}

  async create(data: Summary): Promise<Summary> {
    const persistenceModel = SummaryMapper.toPersistence(data);
    const newEntity = await this.historiesRepository.save(
      this.historiesRepository.create(persistenceModel),
    );
    return SummaryMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
  }: {
    sortOptions?: SortSummaryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Summary[]> {
    const where: FindOptionsWhere<SummaryEntity> = {};
    const entities = await this.historiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: where,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((summary) => SummaryMapper.toDomain(summary));
  }

  async findOne(
    fields: EntityCondition<Summary>,
  ): Promise<NullableType<Summary>> {
    const entity = await this.historiesRepository.findOne({
      where: fields as FindOptionsWhere<SummaryEntity>,
    });

    return entity ? SummaryMapper.toDomain(entity) : null;
  }

  async softDelete(id: Summary['id']): Promise<void> {
    await this.historiesRepository.softDelete(id);
  }
}
