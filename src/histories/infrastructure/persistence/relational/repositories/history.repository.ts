import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { EntityCondition } from '../../../../../utils/types/entity-condition.type';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { HistoryRepository } from '../../histories.repository';
import { HistoryEntity } from '../entities/history.entity';
import { History } from '../../../../domain/history';
import { HistoryMapper } from '../mappers/history.mapper';
import { SortHistoryDto } from '../../../../dto/query-history.dto';

@Injectable()
export class HistoriesRelationalRepository implements HistoryRepository {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historiesRepository: Repository<HistoryEntity>,
  ) {}

  async create(data: History): Promise<History> {
    const persistenceModel = HistoryMapper.toPersistence(data);
    const newEntity = await this.historiesRepository.save(
      this.historiesRepository.create(persistenceModel),
    );
    return HistoryMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    sortOptions,
    paginationOptions,
    whereOptions,
  }: {
    sortOptions?: SortHistoryDto[] | null;
    paginationOptions: IPaginationOptions;
    whereOptions?: FindOptionsWhere<HistoryEntity>;
  }): Promise<History[]> {
    const entities = await this.historiesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: whereOptions,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });

    return entities.map((history) => HistoryMapper.toDomain(history));
  }

  async findOne(
    fields: EntityCondition<History>,
  ): Promise<NullableType<History>> {
    const entity = await this.historiesRepository.findOne({
      where: fields as FindOptionsWhere<HistoryEntity>,
    });

    return entity ? HistoryMapper.toDomain(entity) : null;
  }

  async softDelete(id: History['id']): Promise<void> {
    await this.historiesRepository.softDelete(id);
  }

  async delete(id: History['id']): Promise<void> {
    await this.historiesRepository.delete(id);
  }
}
